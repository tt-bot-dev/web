/**
 * Copyright (C) 2022 tt.bot dev team
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

import polka from "polka";
import type { Request } from "express";
import { Logger } from "sosamba";
import type { ErrorWithCode } from "./utils/types.mjs";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import { createServer as createHTTPSServer } from "https";
import { createServer as createHTTPServer } from "http";
import type { RequestListener } from "http";
import csurf from "csurf";

import createAuthModule from "./auth.mjs";
import loadMiddleWare from "./middleware.mjs";

import session from "express-session";
import SessionStore from "./utils/SessionStore.mjs";
const SessStore = SessionStore(session);

import robotsRoute from "./routes/robots.mjs";
import authRoutes from "./routes/auth.mjs";
import dashboardRoutes from "./routes/dashboard.mjs";
import profileRoutes from "./routes/profile.mjs";
import apiRoutes from "./routes/api.mjs";
import staticRoutes from "./routes/static.mjs";
import licenseRoutes from "./routes/versions.mjs";

import render from "./utils/render.mjs";
import makeTemplatingData from "./utils/makeTemplateData.mjs";
import isOwner from "./utils/isOwner.mjs";
import { join } from "path";
import { fileURLToPath } from "url";

const csrfProtection = csurf({
    value: req =>
        req.body?._csrf ||
        req.query?._csrf ||
        req.query?.state ||
        req.headers["csrf-token"] ||
        req.headers["xsrf-token"] ||
        req.headers["x-csrf-token"] ||
        req.headers["x-xsrf-token"],
}) as unknown as typeof csurf;


export default function launchWebServer(bot: TTBotClient, config: Config): void {
    const log = new Logger({
        name: "Web Panel",
    });

    const app = polka({
        async onError(err, req, res) {
            const r = req as unknown as Request;
            const e = err as ErrorWithCode;
            if (e.code === "EBADCSRFTOKEN")  {
                res.statusCode = 403;
                await render(res, "500", makeTemplatingData(r, bot, config, {
                    error: "Missing CSRF token! Please try this action again.",
                    pageTitle: "Cross Site Request Forgery",
                }));
                return;
            }

            log.error(err);
            res.statusCode = 500;
            await render(res, "500", makeTemplatingData(r, bot, config, {
                pageTitle: "Error",
                error: r.user && isOwner(config, r.user.id) ? err.stack : err.message,
            }));
        },

        async onNoMatch(req, res) {
            res.statusCode = 404;
            await render(res, "404", makeTemplatingData(req as unknown as Request, bot, config));
            // res.render(404);
        },
    });

    const sessStore = new SessStore(bot.db, log);

    const auth = createAuthModule(bot, config, sessStore);

    loadMiddleWare(app, bot, log, config, auth, sessStore);

    if (config.webserver.serveStatic) {
        app.use("/static", staticRoutes(app, join(fileURLToPath(import.meta.url), "../../../dist-client")));
    }

    app.get("/", async (rq, rs) => {
        await render(rs, "landing", makeTemplatingData(rq, bot, config));
    });

    robotsRoute(app);
    authRoutes(app, csrfProtection, config, auth, bot);
    dashboardRoutes(app, csrfProtection, config, bot);
    profileRoutes(app, csrfProtection, config, bot);
    apiRoutes(app, csrfProtection, config, bot);
    licenseRoutes(app, csrfProtection, config, bot);

    createHTTPServer(app.handler as RequestListener)
        .listen(config.webserver.httpPort, config.webserver.host ?? "0.0.0.0", () => {
            log.info("Loaded HTTP dashboard");
        });

    if (config.webserver.httpsPort) {
        createHTTPSServer(config.webserver.httpsSettings ?? {}, app.handler as RequestListener)
            .listen(config.webserver.httpsPort, config.webserver.host ?? "0.0.0.0", () => {
                log.info("Loaded HTTPS dashboard");
            });
    }
}
