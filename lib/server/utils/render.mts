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

import type { ServerResponse } from "http";
import type { Response } from "express";
import ejs, { Data } from "ejs";
import send from "@polka/send-type";

export default async function render(rs: ServerResponse | Response, file: string, data: Data = {}, isHTML = true): Promise<void> {
    const p = `${__dirname}/../../../views/${file}${file.endsWith(".ejs") ? "" : ".ejs"}`;
    const str = await ejs.renderFile(p, data);
    send(rs, 200, str, isHTML ? { "Content-Type": "text/html" } : {});
}