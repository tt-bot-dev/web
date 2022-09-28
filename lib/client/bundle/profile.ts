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

import API from "../ttBotAPI";
import createModal from "../ui/YesNoModal";

import { setupAutofill, saveButton, localeSelector, timezoneField } from "../profileCommon";
import * as Selectors from "../ui/ProfileSelectors";
import type { UserProfile } from "@tt-bot-dev/types";

setupAutofill();

function createDeleteModal() {
    const b = document.createElement("b");
    b.innerText = "This action is irreversible!";

    createModal("Are you sure you want to delete your profile?", "Delete", ["is-danger"], "Cancel", [], 
        async choice => {
            if (choice) {
                await API.deleteUserProfile();
                globalThis.location.assign("/");
            }
        }, b);
}

function setValues(profile: UserProfile) {
    const locale = localeSelector.options.namedItem(profile.locale ?? "en");
    if (locale) {
        locale.selected = true;
    }
    localeSelector.parentElement?.classList.remove("is-loading");
    
    timezoneField.value = profile.timezone ?? "";
    timezoneField.parentElement?.classList.remove("is-loading");
}

const deleteButton = <HTMLButtonElement>document.querySelector(Selectors.Delete)!;

deleteButton.addEventListener("click", () => {
    createDeleteModal();
});

API.bindToSaveButton<typeof API["updateUserProfile"], [], Omit<UserProfile, "id" | "fake">, UserProfile>
(d => API.updateUserProfile(d), saveButton, setValues, cb => {
    const { value: locale } = localeSelector.selectedOptions[0] ?? { value: "en" };
    
    cb({
        timezone: timezoneField.value,
        locale,
    });
}, () => API.userProfile!);

API.getUserProfile().then(setValues);
