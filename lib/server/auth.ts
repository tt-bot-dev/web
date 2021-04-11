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

import type { OAuth2User, ErrorWithCode } from "./utils/types";
import type { Client as ErisClient } from "eris";
import type { Request, Response } from "express-serve-static-core";
import { Eris } from "sosamba";
const { Client } = Eris;
import Cache from "./utils/Cache";
import { post } from "chainfetch";
import { DiscordAPIBase } from "../common/constants";
import type { APIUser, RESTGetAPICurrentUserGuildsResult } from "discord-api-types/v6";
import type { Next } from "polka";
import type { Config, TTBotClient } from "@tt-bot-dev/types";
import type { Store } from "express-session";
import { OAuthScopes } from "../common/constants";

export type UserData = {
    user: OAuth2User,
    client: ErisClient
};

declare module "express-session" {
    interface SessionData {
        tokenData: {
            accessToken: string;
            refreshToken: string;
            expiry: number;
            date: number;
            redirURI: string;
        }
    }
}

export default function createAuthModule(bot: TTBotClient, config: Config, sessStore: Store): Authenticator {
    async function getUserInfo(token: string, cache: Cache<UserData>): Promise<{
        user: OAuth2User,
        client: ErisClient
    }> {
        const c = cache._cache[token]?.data?.client ?? new Client(`Bearer ${token}`, {
            restMode: true
        });
        try {
            const [ userData, guilds ] = await Promise.all([
                <APIUser><unknown>await c.requestHandler.request("GET", "/users/@me", true),
                <RESTGetAPICurrentUserGuildsResult><unknown>await c.requestHandler.request("GET", "/users/@me/guilds", true)
            ]);
    
            return {
                user: {
                    ...userData,
                    guilds
                },
                client: c
            };
    
        } catch (err) {
            if (err.code === "ETIMEDOUT") return cache._cache[token]?.data;
            else throw err;
        }
    }
    
    
    const userCache = new Cache<UserData>(60000, async (token, cache) => {
        try {
            return await getUserInfo(token, cache);
        } catch (e) {
            return { error: e };
        }
    }, async (err, addl) => {
        if (
            // The access token is revoked, or does not have appropriate permissions
            (<ErrorWithCode>err).code !== 401
        ) return;

        await new Promise<void>((rs, rj) => sessStore.destroy(<string>addl, e => e ? rs() : rj(e)));
    });
    const authToken = `Basic ${Buffer.from(`${config.clientID}:${config.clientSecret}`).toString("base64")}`;
    
    const auth: Authenticator = {
        async checkAuth(rq: Request, rs: Response, nx: Next) {
            const reCache = rq.path !== "/logout";

            if (!rq.session.tokenData) return nx();
            else {
                if (Date.now() - rq.session.tokenData.date >= rq.session.tokenData.expiry) {
                    try {
                        await auth.refreshToken(rq.session.tokenData.refreshToken, rq);
                    } catch {
                        return nx();
                    }
                }
    
                let userData: UserData;
                try {
                    userData = await userCache.get(rq.session.tokenData.accessToken, rq.sessionID, reCache);
                } catch {
                    return nx();
                }
                
                rq.user = userData.user;
                rq.signedIn = true;
                nx();
            }
        },
    
        async refreshToken(code: string, rq: Request) {
            const data = await post(`${DiscordAPIBase}/token`)
                .set("Authorization", authToken)
                .attach({
                    refresh_token: code,
                    grant_type: "refresh_token"
                })
                .toJSON();
            const { body } = data;
            const dateAfterReq = Date.now();
            const userData = await userCache.get(body.access_token, rq.sessionID);
            rq.session.tokenData = {
                accessToken: body.access_token,
                refreshToken: body.refresh_token,
                expiry: body.expires_in * 1000,
                date: dateAfterReq,
                // Most decent browsers provide a Host header nowadays
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                redirURI: `${rq.protocol}://${rq.headers.host!}/callback`
            };
            rq.user = userData.user;
        },
    
        async getAccessToken(code: string, rq: Request) {
            const data = await post(`${DiscordAPIBase}/token`)
                .set("Authorization", authToken)
                .attach({
                    client_id: config.clientID,
                    client_secret: config.clientSecret,
                    code,
                    scope: OAuthScopes.join(" "),
                    grant_type: "authorization_code",
                    // Most decent browsers provide a Host header nowadays
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    redirect_uri: `${rq.protocol}://${rq.headers.host!}/callback`
                })
                .toJSON();
            const { body } = data;
            const { scope } = body;
            const grantedScopes = scope.split(" ");
            if (OAuthScopes.some(scope => !grantedScopes.includes(scope))) {
                const sess = {
                    tokenData: {
                        accessToken: body.access_token,
                        refreshToken: body.refresh_token
                    },

                    destroy(cb: (err: unknown) => void): void {
                        cb(undefined);
                    }
                };

                await this.logout({
                    // @ts-expect-error: Partial object to discard the tokens
                    session: sess
                });
                throw new Error("Scopes required for operation of the application were not granted");
            }

            const dateAfterReq = Date.now();
            const userData = await userCache.get(body.access_token, rq.sessionID);
            rq.session.tokenData = {
                accessToken: body.access_token,
                refreshToken: body.refresh_token,
                expiry: body.expires_in * 1000,
                date: dateAfterReq,
                // Most decent browsers provide a Host header nowadays
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                redirURI: `${rq.protocol}://${rq.headers.host!}/callback`
            };

            rq.user = userData.user;
        },

        getUserInfo,

        async logout(rq: Request) {
            if (!rq.session.tokenData) return;

            //@ts-expect-error: Chainfetch objects are thenables, however, the implementation of then() in the typings seems to be broken.
            await Promise.all([
                post(`${DiscordAPIBase}/token/revoke`)
                    .set("Authorization", authToken)
                    .attach({
                        token: rq.session.tokenData.accessToken,
                        token_type_hint: "access_token"
                    }),

                post(`${DiscordAPIBase}/token/revoke`)
                    .set("Authorization", authToken)
                    .attach({
                        token: rq.session.tokenData.refreshToken,
                        token_type_hint: "refresh_token"
                    }),
                
                new Promise<void>(rs => {
                    const v = rq.session.tokenData?.accessToken;
                    userCache.remove(v);
                    rq.session.destroy(() => rs());
                })
            ]);
        }
    };

    return auth;
}

export interface Authenticator {
    checkAuth(rq: Request, rs: Response, nx: Next): Promise<void>;
    getAccessToken(code: string, rq: Request): Promise<void>;
    refreshToken(refreshToken: string, rq: Request): Promise<void>;
    getUserInfo(token: string, cache: Cache<UserData>): Promise<{
        user: OAuth2User,
        client: ErisClient
    }>;
    logout(rq: Request): Promise<void>
}