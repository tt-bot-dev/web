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

import * as Selectors from "./ui/ProfileSelectors";

// Keep in sync with officially supported languages
export const languageMap = {
    "en-US": "en",
    "en": "en",
    "cs": "cs-CZ",
    "cs-CZ": "cs-CZ",
    "sk": "sk-SK",
    "sk-SK": "sk-SK",
    "ro": "ro-RO",
    "ro-RO": "ro-RO"
} as Record<string, string>;

export const autofillButton = <HTMLButtonElement>document.querySelector(Selectors.Autofill)!;
export const saveButton = <HTMLButtonElement>document.querySelector(Selectors.Save)!;
export const localeSelector = <HTMLSelectElement>document.querySelector(Selectors.LocaleSelector)!;
export const timezoneField = <HTMLInputElement>document.querySelector(Selectors.TimezoneSelector)!;

export function isValidTimezone(tz: string): boolean {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });

        return true;
    } catch {
        return false;
    }
}

export function setupAutofill(): void {
    autofillButton.addEventListener("click", () => {
        const resolvedLocalData = Intl.DateTimeFormat().resolvedOptions();
        const lang = Object.prototype.hasOwnProperty.call(languageMap, resolvedLocalData.locale) ? languageMap[resolvedLocalData.locale] : "en";
        const locales = localeSelector.querySelectorAll("option");
    
        for (const locale of locales) {
            if (locale.value === lang) {
                locale.selected = true;
                break;
            }
        }

        timezoneField.value = resolvedLocalData.timeZone;
    });
}