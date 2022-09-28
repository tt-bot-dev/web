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
import checkNotAuth from "../middleware/checkNotAuth.mjs";
import { OAuthScopes } from "../../common/constants.mjs";
import type { Authenticator } from "../auth.mjs";
import checkAuth from "../middleware/checkAuth.mjs";
import render from "../utils/render.mjs";
import makeTemplatingData from "../utils/makeTemplateData.mjs";


export default function (app: Polka, csrfProtection: typeof import("csurf"), config: Config, auth: Authenticator, bot: TTBotClient): void {
    app.get("/login", checkNotAuth(), csrfProtection(), (rq, rs) => {
        const redirectURI = encodeURIComponent(`${rq.protocol}://${rq.headers.host}/callback`);
        rs.redirect(`https://discord.com/oauth2/authorize?client_id=${config.clientID}&scope=${encodeURIComponent(OAuthScopes.join(" "))}&response_type=code&redirect_uri=${redirectURI}&state=${rq.csrfToken()}`);
    });

    app.get("/callback", csrfProtection({
        ignoreMethods: ["HEAD", "OPTIONS"],
    }), async (rq, rs) => {
        if (rq.query.error) {
            rs.status(401);
            await render(rs, "500", makeTemplatingData(rq, bot, config, {
                error: `OAuth authorization error: ${rq.query.error_description} (${rq.query.error})`,
                not500: true,
            }));
            return;
        }
        if (!rq.query.code) return rs.redirect("/login");
        try {
            await auth.getAccessToken(rq.query.code as string, rq);
        } catch {
            return rs.redirect("/login");
        }
        await new Promise<void>((res, rj) => {
            rq.session.save(e => {
                if (e) rj(e);
                else res();
            });
        });

        rs.redirect("/");
    });

    app.get("/logout", checkAuth(), async (rq, rs) => {
        await auth.logout(rq);
        rs.redirect("/");
    });
}
