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

import type { UserProfile } from "@tt-bot-dev/types";
import API from "../ttBotAPI";
import createNotification from "../ui/Notification";
import * as Selectors from "../ui/ProfileSelectors";

import { setupAutofill, saveButton, localeSelector, timezoneField, isValidTimezone } from "../profileCommon";

setupAutofill();

const container = <HTMLElement>document.querySelector(Selectors.MainContentContainer)!;

saveButton.addEventListener("click", async () => {
    saveButton.disabled = true;
    saveButton.classList.add("is-loading");
    const { value: locale } = localeSelector.selectedOptions[0] ?? { value: "en" };
    const d: Omit<UserProfile, "id"> = {
        timezone: timezoneField.value,
        locale
    };
    
    

    if (timezoneField.value && !isValidTimezone(timezoneField.value)) {
        const boldTz = document.createElement("b");
        boldTz.innerText = timezoneField.value;

        const IANATzDBLink = document.createElement("a");
        IANATzDBLink.href = "https://en.wikipedia.org/wiki/List_of_tz_database_time_zones#List";
        IANATzDBLink.innerText = "list of valid timezones in the IANA timezone DB";

        container.prepend(createNotification(10000, ["is-danger"], "The input timezone ", boldTz, " is invalid. Please check the ", IANATzDBLink, " and try again."));
    }

    await API.updateUserProfile(d);

    globalThis.location.reload();
});