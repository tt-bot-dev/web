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

import type { TTBotClient, UserProfile as Profile } from "@tt-bot-dev/types";

// Keep in sync with UserProfile in main repo
export default class UserProfile implements Profile {
    public id: string;

    public fake?: boolean;

    public timezone: string | null;

    public locale: string | null;

    #bot: TTBotClient;

    constructor(data: Profile, bot: TTBotClient) {
        this.#bot = bot;
        this.id = data.id;
        this.fake = data.fake;
        this.timezone = data.timezone ? bot.dataEncryption.decrypt(data.timezone) : null;
        this.locale = data.locale ? bot.dataEncryption.decrypt(data.locale) : null;
    }

    toEncryptedObject(): Profile {
        return UserProfile.create(this, this.#bot);
    }

    static create(data: Profile, bot: TTBotClient): Profile {
        return {
            id: data.id,
            timezone: data.timezone && bot.dataEncryption.encrypt(data.timezone),
            locale: data.locale && bot.dataEncryption.encrypt(data.locale),
        };
    }
}
