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

import type { Polka, Middleware } from "polka";

import { promises } from "fs";
import { lookup } from "mime-types";

export default function createStaticMiddleware(polka: Polka, root: string): Middleware {
    return async (rq, rs, nx) => {
        if (rq.method !== "GET") {
            nx();
            return;
        }
        if (rs.finished || rs.writableEnded) return;
        const path = `${root}/${rq.path}`;

        let stat;
        try {
            stat = await promises.stat(path);
        } catch {
            // @ts-expect-error: Not typed in Polka's TSDs, but present in Polka
            polka.onNoMatch(rq, rs, nx);
            return;
        }

        if (stat.isDirectory()) {
            try {
                await promises.stat(`${path}/index.html`);
            } catch {
                // @ts-expect-error: Not typed in Polka's TSDs, but present in Polka
                polka.onNoMatch(rq, rs, nx);
                return;
            }

            rs.setHeader("Content-Type", "text/html,charset=utf-8");
            return promises.readFile(`${path}/index.html`)
                .then(b => {
                    rs.send(b);
                })
                .catch(e => {
                    nx(e);
                });
        } else {
            const type = lookup(path) || "application/octet-stream";

            rs.setHeader("Content-Type", type);
            return promises.readFile(path)
                .then(b => {
                    rs.send(b);
                })
                .catch(e => {
                    nx(e);
                });
        }
    };
}
