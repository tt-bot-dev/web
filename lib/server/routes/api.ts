/**
 * Copyright (C) 2021 tt.bot dev team
 * 
 * This file is part of @tt-bot-dev/web.
 * 
 * @tt-bot-dev/web is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * @tt-bot-dev/web is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with @tt-bot-dev/web.  If not, see <http://www.gnu.org/licenses/>.
 */

import checkAuth from "../middleware/checkAuth";
import UserProfile from "../structures/UserProfile";
import { AllowedGuildConfigProperties, AllowedUserProfileProperties, Routes } from "../../common/constants";
import getGuilds from "../utils/getPermittedServers";
import type { Polka } from "polka";
import type { Config, GuildConfig, TTBotClient, UserProfile as Profile } from "@tt-bot-dev/types";
import type { Role } from "eris";

const authNeeded = checkAuth(true);

declare global {
    interface ObjectConstructor {
        keys<T>(obj: T): (keyof T)[];
    }
}


function isValidTz(tz: string) {
    try {
        Intl.DateTimeFormat(undefined, {
            timeZone: tz
        });
        return true;
    } catch {
        return false;
    }
}

export default function (app: Polka, csrfProtection: typeof import("csurf"), config: Config, bot: TTBotClient): void {
    app.get(Routes.guildChannels(), authNeeded, async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guildID)) {
            rs.status(403);
            rs.send({
                error: "Forbidden"
            });
        } else {
            // The bot is present on the guild
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const guild = bot.guilds.get(rq.params.guildID)!;
            return rs.send(guild.channels.filter(c => c.type === 0)
                .sort((a, b) => a.position - b.position)
                .map(c => ({
                    name: c.name,
                    id: c.id
                })));
        }
    });

    app.get(Routes.guildRoles(), authNeeded, async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guildID)) {
            rs.status(403);
            rs.send({
                error: "Forbidden"
            });
        } else {
            // The bot is present on the guild
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const guild = bot.guilds.get(rq.params.guildID)!;
            let roles: Role[];
            if (rq.query.ignoreHierarchy) {
                roles = Array.from(guild.roles.values());
            } else {
                // The bot is present on the guild
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const highestRole = guild.members.get(bot.user.id)!.roles
                    .reduce<Role>((a, b) => {
                        // The role is present on the guild
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        const secondRole = guild.roles.get(b)!;
                        return Math.max(a.position, secondRole.position) === a.position ? a : secondRole;

                        // The role is present on the guild
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    }, guild.roles.get(guild.id)!) || {
                        position: -1
                    };
                roles = guild.roles.filter(r => r.position < highestRole.position);
            }

            rs.send(roles.sort((a, b) => b.position - a.position)
                .map(r => ({
                    name: r.name,
                    id: r.id
                })));
        }
    });

    app.get(Routes.guildConfig(), authNeeded, async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guildID)) {
            rs.status(403);
            rs.send({
                error: "Forbidden"
            });
        } else {
            const data = await bot.db.getGuildConfig(rq.params.guildID);
            rs.send(data);
        }
    });

    app.post(Routes.guildConfig(), authNeeded, csrfProtection(), async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.guildID)) {
            rs.status(403);
            rs.send({
                error: "Forbidden"
            });
        } else {
            const filteredBody: Partial<GuildConfig> = {};
            Object.keys<Record<string, unknown>>(rq.body).filter(k => (<readonly string[]>AllowedGuildConfigProperties).includes(k))
                .forEach(k => {
                    filteredBody[<keyof GuildConfig>k] = rq.body[k] || null;
                });

            filteredBody.id = rq.params.guildID;

            await bot.db.updateGuildConfig(rq.params.guildID, filteredBody);
            rs.send(await bot.db.getGuildConfig(rq.params.guildID));
        }
    });

    app.get(Routes.userProfile(), authNeeded, csrfProtection(), async (rq, rs) => {
        const profileData = await bot.db.getUserProfile(rq.user.id);
        if (!profileData) {
            rs.status(404);
            rs.send({
                error: "Not Found"
            });
            return;
        }
        const profile = new UserProfile(profileData, bot);
        rs.send({
            ...profile,
            csrfToken: rq.csrfToken()
        });
    });

    app.post(Routes.userProfile(), authNeeded, csrfProtection(), async (rq, rs) => {
        const filteredBody: Partial<Profile> = {};
        // Breaks intended typing
        // eslint-disable-next-line no-extra-parens
        Object.keys<Record<string, unknown>>(rq.body).filter(k => (<string[]>AllowedUserProfileProperties).includes(k)).forEach(k => {
            filteredBody[<keyof Profile>k] = rq.body[k] || null;
        });
        filteredBody.id = rq.user.id;
        // @ts-expect-error: Not typed in Sosamba yet
        if (!bot.localeManager.locales.has(filteredBody.locale)) {
            rs.status(400);
            rs.send({
                error: "Invalid locale"
            });
            return;
        }

        if (filteredBody.timezone && !isValidTz(filteredBody.timezone)) {
            rs.status(400);
            rs.send({
                error: "Invalid timezone. Refer to https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List for a list of correct timezones"
            });
            return;
        }

        const profile = UserProfile.create(<Profile><unknown>filteredBody, bot);
        if (!await bot.db.getUserProfile(rq.user.id)) {
            await bot.db.createUserProfile(profile);
        } else {
            await bot.db.updateUserProfile(rq.user.id, profile);
        }

        const profileData = await bot.db.getUserProfile(rq.user.id);
        // The profile data is very likely present
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return rs.send(new UserProfile(profileData!, bot));
    });

    app.delete(Routes.userProfile(), authNeeded, csrfProtection(), async (rq, rs) => {
        if (!await bot.db.getUserProfile(rq.user.id)) {
            rs.status(404);
            rs.send({
                error: "Profile not found"
            });
            return;
        }
        await bot.db.deleteUserProfile(rq.user.id);
        rs.status(204);
        rs.end();
    });
}