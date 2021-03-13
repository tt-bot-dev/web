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

import type { Polka } from "polka";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import checkAuth from "../middleware/checkAuth";
import render from "../utils/render";
import makeTemplatingData from "../utils/makeTemplateData";
import UserProfile from "../structures/UserProfile";

export default function (app: Polka, csrfProtection: typeof import("csurf"), config: Config, bot: TTBotClient): void {
    app.get("/profile", csrfProtection(), checkAuth(), async (rq, rs) => {
        const profileData = await bot.db.getUserProfile(rq.user.id);
        if (!profileData) {
            await render(rs, "profile-create", makeTemplatingData(rq, bot, config, {
                pageTitle: "Profile",
                // @ts-expect-error: Not typed in sosamba yet
                locales: Array.from(bot.localeManager.locales.keys()),
                csrfToken: rq.csrfToken()
            }));
        } else {
            const profile = new UserProfile(profileData, bot);
            await render(rs, "profile", makeTemplatingData(rq, bot, config, {
                pageTitle: "Profile",
                // @ts-expect-error: Not typed in sosamba yet
                locales: Array.from(bot.localeManager.locales.keys()),
                profile,
                csrfToken: rq.csrfToken()
            }));
        }
    });
}
