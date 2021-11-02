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

import getGuilds from "../utils/getPermittedServers";
import type { Polka } from "polka";
import type { Config, DBProvider, GuildConfig, TTBotClient } from "@tt-bot-dev/types";
import checkAuth from "../middleware/checkAuth";
import render from "../utils/render";
import makeTemplatingData from "../utils/makeTemplateData";

const { availableTypes } = require.main?.require("./lib/logging");

async function makeDefaultConfig(db: DBProvider, config: Config, guildID: string): Promise<Partial<GuildConfig>> {
    const guildConfig = {
        id: guildID,
        prefix: config.prefix
    };
    await db.createGuildConfig(guildConfig);
    return guildConfig;
}

export default function (app: Polka, csrfProtection: typeof import("csurf"), config: Config, bot: TTBotClient): void {
    app.get("/dashboard", checkAuth(), async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        await render(rs, "dashboard", makeTemplatingData(rq, bot, config, {
            guilds,
            pageTitle: "Dashboard"
        }));
    });

    app.get("/dashboard/:id", checkAuth(), csrfProtection(), async (rq, rs) => {
        const guilds = getGuilds(bot, config, rq, rs);
        if (!guilds) return;
        if (!guilds.find(g => g.isOnServer && g.id === rq.params.id)) return rs.sendStatus(403);
        else {
            const guildData = await bot.db.getGuildConfig(rq.params.id) || await makeDefaultConfig(bot.db, config, rq.params.id);
            // The bot is present on the guild
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const erisGuild = bot.guilds.get(rq.params.id)!;

            await render(rs, "dashboard-server", makeTemplatingData(rq, bot, config, {
                guild: guildData,
                erisGuild,
                pageTitle: erisGuild.name,
                availableLoggingTypes: availableTypes,
                // @ts-expect-error: Not typed in sosamba yet
                locales: Array.from(bot.localeManager.locales.keys()),
                csrfToken: rq.csrfToken()
            }));
        }
    });
}
