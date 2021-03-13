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

import type { GuildExtension, UserProfile } from "@tt-bot-dev/types";

export const DiscordAPIBase = "https://discord.com/api/v8/oauth2";
export const OAuthScopes = ["identify", "guilds"] as const;
export const UUIDRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const PrivilegedExtensionScopes = ["httpRequests", "dangerousGuildSettings"] as const;
export const AllowedGuildConfigProperties = [
    "prefix",
    "modRole",
    "farewellMessage",
    "farewellChannelId",
    "greetingMessage",
    "greetingChannelId",
    "agreeChannel",
    "memberRole",
    "logChannel",
    "logEvents",
    "modlogChannel",
    "locale"
] as const;

export const AllowedGuildExtensionProperties = [
    "code",
    "allowedChannels",
    "allowedRoles",
    "commandTrigger",
    "name",
    "store",
    "flags"
] as const;

export const DefaultExtension: Omit<GuildExtension, "guildID"> = {
    allowedChannels: [],
    allowedRoles: [],
    commandTrigger: "",
    code: "import { context } from \"tt.bot/context.js\";\n\ncontext.reply(\"Hello there!\");\n",
    name: "My new extension",
    id: "new",
    flags: 0,
    privilegedFlags: 0,
    store: ""
};

export const DefaultExtensionKeys = <(keyof typeof DefaultExtension)[]><unknown>Object.keys(DefaultExtension);

export const AllowedUserProfileProperties: readonly (keyof UserProfile)[] = [
    "timezone",
    "locale"
] as const;

export const ExtensionFlags = {
    httpRequests: 1,
    guildSettings: 1 << 1,
    dangerousGuildSettings: 1 << 2,
    guildModerative: 1 << 3,
    guildMembersMeta: 1 << 4,
    mentionEveryone: 1 << 5
} as const;

export const ExtensionFlagKeys = <(keyof typeof ExtensionFlags)[]><unknown>Object.keys(ExtensionFlags);

export const Routes = {
    guildChannels: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/channels`,
    guildRoles: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/roles`,
    guildConfig: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/config`,
    guildExtension: (guildID = ":guildID", extensionID = ":extensionID") => `/api/v2/guilds/${guildID}/extensions/${extensionID}`,
    userProfile: () => "/api/v2/users/@me/profile"
} as const;