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

import type { GuildConfig, UserProfile } from "@tt-bot-dev/types";
// @ts-expect-error: Parcel cannot deal with ESM TS imports yet
import { Routes } from "../common/constants.mts";
// @ts-expect-error: Parcel cannot deal with ESM TS imports yet
import type { AllowedGuildConfigProperties } from "../common/constants.mts";
import createModal from "./ui/InfoModal";
export interface RoleOrChannel {
    name: string;
    id: string;
}

export type APIGuildConfig = {
    [k in typeof AllowedGuildConfigProperties[number]]: GuildConfig[k];
};

export class FetchError extends Error {
    public constructor(public res: Response, message?: string) {
        super(message);
    }
}

export class TTBotAPI {
    public csrfToken?: string = TTBotAPI.getCSRFTokenFromMeta();
    public guildID?: string = TTBotAPI.getGuildIDFromMeta();

    public guildConfig?: GuildConfig;
    public userProfile?: UserProfile;

    private savingDashboardChanges = false;

    public async updateGuildConfig(guildID: string, data: APIGuildConfig): Promise<GuildConfig> {
        if (!this.csrfToken) throw new Error("CSRF token missing");
        const r = await this.fetch(Routes.guildConfig(guildID), {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": this.csrfToken
            }
        });
        const cfg = await r.json();
        return this.guildConfig = cfg;
    }

    public async getAvailableChannels(guildID: string): Promise<RoleOrChannel[]> {
        const r = await this.fetch(Routes.guildChannels(guildID), {
            credentials: "include"
        });
        return await r.json();
    }

    public async getAvailableRoles(guildID: string, ignoreHierarchy = false): Promise<RoleOrChannel[]> {
        const r = await this.fetch(`${Routes.guildRoles(guildID)}${ignoreHierarchy ? "?ignoreHierarchy=true" : ""}`, {
            credentials: "include"
        });
        return await r.json();
    }

    public async getGuildConfig(guildID: string): Promise<GuildConfig> {
        const r = await this.fetch(Routes.guildConfig(guildID), {
            credentials: "include"
        });
        const cfg = await r.json();
        return this.guildConfig = cfg;
    }

    public async getUserProfile(): Promise<UserProfile> {
        const r = await this.fetch(Routes.userProfile(), {
            credentials: "include"
        });
        const profile = await r.json();
        this.csrfToken = profile.csrfToken;
        delete profile.csrfToken;
        return this.userProfile = profile;
    }

    public async updateUserProfile(data: Omit<UserProfile, "id" | "fake">): Promise<UserProfile> {
        if (!this.csrfToken) throw new Error("CSRF token missing");
        const r = await this.fetch(Routes.userProfile(), {
            credentials: "include",
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": this.csrfToken
            }
        });
        const profile = await r.json();
        return this.userProfile = profile;
    }

    public async deleteUserProfile(): Promise<void> {
        if (!this.csrfToken) throw new Error("CSRF token missing");
        await this.fetch(Routes.userProfile(), {
            credentials: "include",
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "CSRF-Token": this.csrfToken
            }
        });
    }

    public bindToSaveButton<K extends (...args: [...P, TIn]) => Promise<TOut>, P extends unknown[], TIn, TOut>(method: K, element: HTMLButtonElement, cb: (output: TOut) => void, dataCollector: (cb: (data: TIn | false) => void) => void, fallback: () => TOut, ...args: P): void {
        element.addEventListener("click", () => {
            if (this.savingDashboardChanges) return false;
            this.savingDashboardChanges = true;
            element.classList.add("is-loading");
            element.disabled = true;
            dataCollector(data => {
                const unlock = () => {
                    element.classList.remove("is-loading");
                    element.disabled = false;
                    this.savingDashboardChanges = false;
                };
                
                (data === false ? Promise.resolve(fallback()) : <Promise<TOut>>method.call(this, ...args, data)).then(out => {
                    unlock();
                    cb(out);
                }).catch(() => {
                    unlock();
                });
            });
        });
    }

    public bindToResetButton<K extends (arg: T) => void, T>(element: HTMLButtonElement, fn: K, data: T): void {
        element.addEventListener("click", () => {
            fn(data);
        });
    }

    private fetch(...args: Parameters<typeof globalThis.fetch>): Promise<Response> {
        return globalThis.fetch(...args).then(this.onResponse);
    }

    private async onResponse(r: Response) {
        if (!r.ok) {
            const pre = document.createElement("pre");
            {
                const code = document.createElement("code");

                code.innerText = await r.text();

                pre.append(code);
            }

            createModal("An error has occured", `Received a non-200 OK response from the server: (${r.status} ${r.statusText}):`,
                document.createElement("br"),
                "Response",
                document.createElement("br"),
                pre);
            
            
            const error = new FetchError(r);
            throw error;
        } else {
            return r;
        }
    }

    public static getGuildIDFromMeta(): string | undefined {
        return (<HTMLMetaElement>document.querySelector("meta[name=\"tt.bot::guildID\"]"))?.content;
    }

    public static getCSRFTokenFromMeta(): string | undefined {
        return (<HTMLMetaElement>document.querySelector("meta[name=\"tt.bot::csrfToken\"]"))?.content;
    }
}

/**
 * The singleton of the tt.bot client-side API
 */
export default new TTBotAPI;