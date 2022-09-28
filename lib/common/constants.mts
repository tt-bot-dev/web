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

export const DiscordAPIBase = "https://discord.com/api/v9/oauth2";
export const OAuthScopes = ["identify", "guilds"] as const;
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
    "locale",
] as const;

export const AllowedGuildExtensionProperties = [
    "code",
    "allowedChannels",
    "allowedRoles",
    "commandTrigger",
    "name",
    "store",
    "flags",
] as const;

export const AllowedUserProfileProperties = [
    "locale",
    "timezone",
] as const;

export const Routes = {
    guildChannels: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/channels`,
    guildRoles: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/roles`,
    guildConfig: (guildID = ":guildID") => `/api/v2/guilds/${guildID}/config`,
    userProfile: () => "/api/v2/users/@me/profile",
} as const;
