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
import type { Logger } from "sosamba";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import cookieParser from "cookie-parser";
import { sign } from "cookie-signature";
import { serialize } from "cookie";
import bodyParser from "body-parser";
import send from "@polka/send-type";
import redirect from "@polka/redirect";
import { STATUS_CODES as HTTPStatusCodes } from "http";
import session from "express-session";
import type { TLSSocket } from "tls";
import type { OAuth2User } from "./utils/types";
import type { Authenticator } from "./auth";

declare global {
    // Namespace augmentation
    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Express {
        export interface Request {
            user: OAuth2User;
            signedIn: boolean;
        }
    }
}



export default function loadMiddleWare(app: Polka, bot: TTBotClient, log: Logger, config: Config, auth: Authenticator, store: session.Store): void {
    app.use((rq, rs, nx) => {
        // @ts-expect-error: I cannot do types properly for this
        rs.cookie = (name, value, options) => {
            const opts = Object.assign({}, options);
            // @ts-expect-error: This is not typed by @types/cookie-parser correctly
            const { secret } = rq;

            let val = typeof value === "object"
                ? `j:${JSON.stringify(value)}`
                : String(value);

            if (options.signed) {
                val = `s:${sign(val, secret)}`;
            }

            if ("maxAge" in opts) {
                opts.expires = new Date(Date.now() + opts.maxAge);
                opts.maxAge /= 1000;
            }

            if (opts.path == null) {
                opts.path = "/";
            }

            rs.setHeader("Set-Cookie", serialize(name, val, opts));
        };

        //@ts-expect-error: Yet another thing I don't want to type
        rs.redirect = (location: string, code?: number) => {
            redirect(rs, code, location);
        };
        const encSocket = <TLSSocket>rq.socket;
        rq.protocol = rq.headers["x-forwarded-proto"] as string || (encSocket.encrypted ? "https" : "http");
        rq.secure = rq.protocol === "https";
        rs.status = status => {
            void (rs.statusCode = status);
            return rs;
        };
        rs.send = body => {
            send(rs, rs.statusCode, body);
            return rs;
        };
        rs.sendStatus = code => {
            rs.statusCode = code;
            rs.end(HTTPStatusCodes[code] || code);
            return rs;
        };

        nx();
    });
    app.use(bodyParser.json({
        limit: 5 * 1024 * 1024,
    }));

    app.use(cookieParser(config.clientSecret));
    app.use(session({
        secret: config.clientSecret,
        resave: false,
        saveUninitialized: false,
        store,
        cookie: {
            maxAge: 8064e5
        }
    }));

    app.use(auth.checkAuth);
}