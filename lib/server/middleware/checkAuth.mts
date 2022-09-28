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

import type { Request, Response } from "express-serve-static-core";
import type { Next } from "polka";

export default function checkAuth(api = false): (rq: Request, rs: Response, nx: Next) => void {
    return (rq: Request, rs: Response, next: Next) => {
        if (rq.signedIn) return next();
        if (api) {
            rs.status(401).send({
                error: "Unauthorized",
                description: "You aren't authorized to do this operation.",
            });
            return;
        }

        rs.redirect("/login");
    };
}
