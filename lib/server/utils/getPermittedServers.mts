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

import isOwner from "./isOwner.mjs";
import { Eris } from "sosamba";
const { Permission } = Eris;

import type { Config, TTBotClient } from "@tt-bot-dev/types";
import type { Request, Response } from "express-serve-static-core";

export default function getGuilds(bot: TTBotClient, config: Config, rq: Request, rs: Response): ({
    id: string;
    isOnServer: boolean
})[] | void {
    if (!rq.user?.guilds) {
        rs.redirect("/login");
        return;
    }
    if (isOwner(config, rq.user.id)) {
        return [
            ...bot.guilds.map(g => ({
                ...g,
                isOnServer: true
            })),
            ...rq.user.guilds.filter(g => {
                const permission = new Permission(g.permissions, 0);
                return !bot.guilds.has(g.id) && (permission.has("administrator") || permission.has("manageGuild"));
            }).map(g => ({
                ...g,
                isOnServer: false
            }))
        ];
    } else {
        return rq.user.guilds.filter(g => {
            if (bot.guilds.has(g.id)) return bot.isAdmin({
                // The bot is present on the server
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                guild: bot.guilds.get(g.id)!,
                permissions: new Permission(g.permissions, 0),
                id: rq.user.id,
                // @ts-expect-error: The isAdmin function only needs user.id for bot owner checking
                user: rq.user,

            });
            else {
                const permission = new Permission(g.permissions, 0);
                return permission.has("administrator") || permission.has("manageGuild");
            }
        }).map(g => ({
            ...g,
            isOnServer: bot.guilds.has(g.id)
        }));
    }
}