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

import type { GuildConfig } from "@tt-bot-dev/types";
import * as Selectors from "../ui/GuildConfigSelectors";
import API from "../ttBotAPI";
import type { APIGuildConfig } from "../ttBotAPI";

const inputFarewellMessage = <HTMLInputElement>document.querySelector(Selectors.FarewellMessageOption)!;
const inputModRole = <HTMLSelectElement>document.querySelector(Selectors.ModRoleOption)!;
const inputWelcomeMessage = <HTMLInputElement>document.querySelector(Selectors.WelcomeMessageOption)!;
const inputLogEvents = <HTMLInputElement>document.querySelector(Selectors.LogEventsOption)!;
const inputModlogChannel = <HTMLSelectElement>document.querySelector(Selectors.ModlogChannelOption)!;
const inputAgreeChannel = <HTMLSelectElement>document.querySelector(Selectors.AgreeChannelOption)!;
const inputWelcomeChannel = <HTMLSelectElement>document.querySelector(Selectors.WelcomeChannelOption)!;
const inputFarewellChannel = <HTMLSelectElement>document.querySelector(Selectors.FarewellChannelOption)!;
const inputMemberRole = <HTMLSelectElement>document.querySelector(Selectors.MemberRoleOption)!;
const inputLogChannel = <HTMLSelectElement>document.querySelector(Selectors.LogChannelOption)!;
const inputLocale = <HTMLSelectElement>document.querySelector(Selectors.LocaleOption)!;

const saveButton = <HTMLButtonElement>document.querySelector(Selectors.Save)!;
const resetButton = <HTMLButtonElement>document.querySelector(Selectors.Reset)!;

const channelPickers = <NodeListOf<HTMLSelectElement>>document.querySelectorAll(Selectors.ChannelPickers);
const rolePickers = <NodeListOf<HTMLSelectElement>>document.querySelectorAll(Selectors.RolePickers);
const rolePickersNoHierarchy = <NodeListOf<HTMLSelectElement>>document.querySelectorAll(Selectors.RolePickersNoHierarchy);


function loadPickers(isChannelPicker: boolean, channelsOrRoles: ({
    name: string;
    id: string;
})[]) {
    return (element: HTMLSelectElement) => {
        element.innerHTML = "";

        const noneSel = document.createElement("option");
        noneSel.id = "none";
        noneSel.value = "";
        noneSel.innerText = "None";
        noneSel.selected = true;

        element.append(noneSel);

        for (const channelOrRole of channelsOrRoles) {
            const option = document.createElement("option");

            option.id = channelOrRole.id;
            option.value = channelOrRole.id;
            option.innerText = `${isChannelPicker ? "#" : ""}${channelOrRole.name}`;

            element.appendChild(option);
        }
    };
}

function selectElementByID(selector: HTMLSelectElement, value?: string) {
    const opt = (value && selector.options.namedItem(value)) ?? selector.options.namedItem("none");
    if (opt) opt.selected = true;
}

function unlockElement(el: HTMLInputElement | HTMLSelectElement | HTMLOptionElement) {
    el.parentElement?.classList.remove("is-loading");
    el.disabled = false;
}

function setValues(cfg: GuildConfig) {
    inputFarewellMessage.value = cfg.farewellMessage ?? "";
    inputWelcomeMessage.value = cfg.greetingMessage ?? "";
    inputLogEvents.value = cfg.logEvents ?? "";

    selectElementByID(inputFarewellChannel, cfg.farewellChannelId);
    selectElementByID(inputWelcomeChannel, cfg.greetingChannelId);
    selectElementByID(inputAgreeChannel, cfg.agreeChannel);
    selectElementByID(inputLogChannel, cfg.logChannel);
    selectElementByID(inputMemberRole, cfg.memberRole);
    selectElementByID(inputModRole, cfg.modRole);
    selectElementByID(inputModlogChannel, cfg.modlogChannel);
    selectElementByID(inputLocale, cfg.locale);

    unlockElement(inputModRole);
    unlockElement(inputModlogChannel);
    unlockElement(inputFarewellMessage);
    unlockElement(inputWelcomeMessage);
    unlockElement(inputAgreeChannel);
    unlockElement(inputWelcomeChannel);
    unlockElement(inputFarewellChannel);
    unlockElement(inputLogEvents);
    unlockElement(inputLogChannel);
    unlockElement(inputModRole);
    unlockElement(inputLocale);
    unlockElement(inputMemberRole);
}

Promise.all([
    API.getAvailableChannels(API.guildID!),
    API.getAvailableRoles(API.guildID!, false),
    API.getAvailableRoles(API.guildID!, true),
    API.getGuildConfig(API.guildID!),
]).then(([channels, roles, rolesWithoutHierarchy, config]) => {
    channelPickers.forEach(loadPickers(true, channels));
    rolePickers.forEach(loadPickers(false, roles.filter(r => r.id !== API.guildID)));
    rolePickersNoHierarchy.forEach(loadPickers(false, rolesWithoutHierarchy.filter(r => r.id !== API.guildID)));

    setValues(config);

    API.bindToSaveButton<(data: APIGuildConfig) => Promise<GuildConfig>, [], APIGuildConfig, GuildConfig>
        ((data: APIGuildConfig) => API.updateGuildConfig(API.guildID!, data), saveButton, setValues, (cb: (_: APIGuildConfig) => void) => {
            const { value: modRole } = inputModRole.selectedOptions[0] ?? { value: "" };
            const { value: farewellMessage } = inputFarewellMessage;
            const { value: logEvents } = inputLogEvents;
            const { value: farewellChannelId } = inputFarewellChannel.selectedOptions[0] ?? { value: "" };
            const { value: greetingMessage } = inputWelcomeMessage;
            const { value: greetingChannelId } = inputWelcomeChannel.selectedOptions[0] ?? { value: "" };
            const { value: agreeChannel } = inputAgreeChannel.selectedOptions[0] ?? { value: "" };
            const { value: memberRole } = inputMemberRole.selectedOptions[0] ?? { value: "" };
            const { value: logChannel } = inputLogChannel.selectedOptions[0] ?? { value: "" };
            const { value: modlogChannel } = inputModlogChannel.selectedOptions[0] ?? { value: "" };
            const { value: locale } = inputLocale.selectedOptions[0] ?? { value: "" };

            cb(<APIGuildConfig>{
                modRole,
                farewellMessage,
                farewellChannelId,
                logEvents,
                greetingChannelId,
                greetingMessage,
                agreeChannel,
                memberRole,
                logChannel,
                modlogChannel,
                locale,
            });
        }, () => API.guildConfig!);

    API.bindToResetButton(resetButton, setValues, API.guildConfig!);
});

