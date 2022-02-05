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

import type { APIUser } from "discord-api-types/v9";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import type { Request } from "express";
const { default: { version: ttbotVersion }} = await import(`${process.mainModule?.path}/lib/package.mjs`);

export default function makeTemplatingData<T>(rq: Request, bot: TTBotClient, config: Config, object?: T): ({
    user: APIUser | null;
    pageTitle: string;
    isHTTP: boolean;
    host?: string;
    bot: TTBotClient,
    config: Config,
    ttbotVersion: string
} & T);
export default function makeTemplatingData(rq: Request, bot: TTBotClient, config: Config, object?: Record<string, unknown>): ({
    user: APIUser | null;
    pageTitle: string;
    isHTTP: boolean;
    host?: string;
    bot: TTBotClient,
    config: Config,
    ttbotVersion: string;
    [k: string]: unknown;
}) {
    return {
        user: rq.user ?? null,
        pageTitle: "",
        isHTTP: rq.secure,
        host: rq.headers.host,
        bot,
        config,
        ttbotVersion,
        ...object || {}
    };
}
