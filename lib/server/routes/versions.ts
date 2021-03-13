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

// require() is used here to aid readability
/* eslint-disable @typescript-eslint/no-var-requires */

import type { Polka } from "polka";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import render from "../utils/render";
import makeTemplatingData from "../utils/makeTemplateData";

export default function (app: Polka, _: typeof import("csurf"), config: Config, bot: TTBotClient): void {
    app.get("/versions", async (rq, rs) => {
        await render(rs, "versions", makeTemplatingData(rq, bot, config, {
            pageTitle: "Versions",
            e2pVersion: require.main?.require("@tt-bot-dev/e2p/package.json").version,
            extensionRunnerVersion: require.main?.require("@tt-bot-dev/extension-runner/package.json").version,
            sosambaVersion: require.main?.require("sosamba/package.json").version,
            selfVersion: require("../../../package.json").version,
            typesVersion: require("@tt-bot-dev/types/package.json").version
        }));
    });
}