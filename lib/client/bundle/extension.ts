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

import { ExtensionFlags } from "../../common/constants";
import type { AllowedGuildExtensionProperties, DefaultExtensionKeys, } from "../../common/constants";
import API from "../ttBotAPI";
import type { RoleOrChannel } from "../ttBotAPI";

import type { GuildExtension } from "@tt-bot-dev/types";

import createPendingApprovalTags from "../ui/PendingApprovalTag";

import * as Selectors from "../ui/ExtensionPageSelectors";
import createNotification from "../ui/Notification";

const originalTitle = document.title;

const saveButton = <HTMLButtonElement>document.querySelector("button#save");
const resetButton = <HTMLButtonElement>document.querySelector("button#reset");

const channelPicker = document.querySelector(Selectors.ExtensionChannelList)!;
const rolePicker = document.querySelector(Selectors.ExtensionRoleList)!;

let storeCreationNote = document.querySelector(Selectors.StoreCreationNote);

const monacoNotifs = document.querySelector(Selectors.MonacoNotifs)!;

import("../monaco").then(monaco => {

    const model = monaco.editor.createModel("// Loading extension code...", "javascript", monaco.Uri.parse(`file://${API.extensionID!}.js`));

    const editor = monaco.editor.create(<HTMLElement>document.querySelector(Selectors.CodeArea)!, {
        theme: "vs-dark",
        model
    });

    editor.addAction({
        id: "download-code",
        label: "Download code",
        run(editor) {
            const url = URL.createObjectURL(new Blob([editor.getValue()], {
                type: "application/javascript"
            }));

            const el = document.createElement("a");
            el.href = url;
            el.download = "code.js";
            el.click();

            el.remove();
            URL.revokeObjectURL(url);
        },
        contextMenuGroupId: "9_copyandpaste",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S]
    });

    editor.addAction({
        id: "load-code",
        label: "Load code from file",
        run(editor) {
            const inp = document.createElement("input");
            inp.type = "file";

            inp.addEventListener("change", () => {
                const [file] = inp.files ?? [];
                if (!file?.type.includes("javascript")) {
                    const notif = createNotification(5000, ["is-danger"], "The file is not a valid JS file");
                    monacoNotifs.prepend(notif);
                    return;
                }
                file?.text().then(val => {
                    editor.setValue(val);
                });
            });
            
            inp.click();
            inp.remove();
        },
        contextMenuGroupId: "9_copyandpaste",
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_L]
    });

    globalThis.addEventListener("resize", () => {
        editor.layout();
    });

    function loadPickers(isChannelPicker: boolean, channelsOrRoles: RoleOrChannel[]) {
        return (element: HTMLElement) => {
            element.innerHTML = "";

            for (const channelOrRole of channelsOrRoles) {
                const listItem = document.createElement("div");
                listItem.className = "control";

                {
                    const label = document.createElement("label");
                    label.className = "checkbox";

                    {
                        const input = document.createElement("input");
                        input.id = channelOrRole.id;
                        input.type = "checkbox";
                        input.name = isChannelPicker ? "tttie-channels" : "tttie-roles";

                        const span = document.createElement("span");
                        span.innerText = `${isChannelPicker ? "#" : ""}${channelOrRole.name}`;

                        label.append(input, span);
                    }

                    listItem.append(label);
                }

                element.appendChild(listItem);
            }
        };
    }

    function dataCollector(cb: (_: {
        [k in typeof AllowedGuildExtensionProperties[number]]: GuildExtension[k]
    } | false) => void) {
        const allowedChannels = Array.from(<NodeListOf<HTMLInputElement>>channelPicker.querySelectorAll(Selectors.ChannelInputs))
            .filter(c => c.checked).map(c => c.id);

        const allowedRoles = Array.from(<NodeListOf<HTMLInputElement>>rolePicker.querySelectorAll(Selectors.RoleInputs))
            .filter(c => c.checked).map(c => c.id);

        let flags = 0;

        (<NodeListOf<HTMLInputElement>>document.querySelectorAll(Selectors.FlagBoxes))
            .forEach(box => {
                if (Object.prototype.hasOwnProperty.call(ExtensionFlags, box.id) && box.checked) {
                    flags |= ExtensionFlags[<keyof typeof ExtensionFlags>box.id];
                }
            });

        const store = <HTMLInputElement>document.querySelector(Selectors.StorageInput)!;
        if (API.extensionID !== "new" && !store.value) {
            cb(false);
            return;
        }

        const commandTrigger = <HTMLInputElement>document.querySelector(Selectors.CommandTriggerInput)!;
        if (!commandTrigger.value || commandTrigger.value.includes(" ")) {
            cb(false);
            return;
        }

        const code = editor.getValue();

        const name = <HTMLInputElement>document.querySelector(Selectors.ExtensionName)!;
        if (!name.value || name.value.length > 100) {
            cb(false);
            return;
        }

        cb({
            allowedChannels,
            allowedRoles,
            commandTrigger: commandTrigger.value,
            code,
            name: name.value,
            store: store.value || "",
            flags
        });
    }


    function setValues(extension: {
        [k in typeof DefaultExtensionKeys[number]]: GuildExtension[k]
    }) {
        if (extension.id === "new") document.title = `${originalTitle} - New extension`;
        else document.title = `${originalTitle} - Extension: ${extension.name}`;

        const titles = <NodeListOf<HTMLElement>>document.querySelectorAll(Selectors.Title);
        const idSpans = <NodeListOf<HTMLElement>>document.querySelectorAll(Selectors.ExtensionIDSpan);
        for (const title of titles) {
            if (extension.id === "new") title.innerText = "New extension";
            else title.innerText = extension.name;
        }

        for (const idSpan of idSpans) {
            idSpan.innerText = extension.id;
        }

        if (extension.id !== "new") {
            storeCreationNote?.remove();
            storeCreationNote = null;
        }

        const extensionName = <HTMLInputElement>document.querySelector(Selectors.ExtensionName)!;
        extensionName.value = extension.name;
        extensionName.parentElement?.classList.remove("is-loading");

        const commandTrigger = <HTMLInputElement>document.querySelector(Selectors.CommandTriggerInput)!;
        commandTrigger.value = extension.commandTrigger;
        commandTrigger.parentElement?.classList.remove("is-loading");

        for (const inp of <NodeListOf<HTMLInputElement>>channelPicker.querySelectorAll(Selectors.ChannelInputs)) {
            if (extension.allowedChannels.includes(inp.id)) inp.checked = true;
            else inp.checked = false;
        }


        for (const inp of <NodeListOf<HTMLInputElement>>rolePicker.querySelectorAll(Selectors.RoleInputs)) {
            if (extension.allowedRoles.includes(inp.id)) inp.checked = true;
            else inp.checked = false;
        }

        const store = <HTMLInputElement>document.querySelector(Selectors.StorageInput)!;
        store.value = extension.store;
        store.parentElement?.classList.remove("is-loading");


        const flagBoxes = document.querySelectorAll(Selectors.FlagBoxes);

        for (const box of <NodeListOf<HTMLInputElement>>flagBoxes) {
            const control = box.parentElement?.parentElement;
            const loadingSelector = control?.querySelector(Selectors.TagBox);

            if (Object.prototype.hasOwnProperty.call(ExtensionFlags, box.id)) {
                if (extension.flags & ExtensionFlags[<keyof typeof ExtensionFlags>box.id]) {
                    box.checked = true;
                    if (loadingSelector) loadingSelector.remove();
                } else if (extension.privilegedFlags & ExtensionFlags[<keyof typeof ExtensionFlags>box.id]) {
                    box.checked = true;
                    if (!loadingSelector) box.parentElement?.insertAdjacentElement("afterend", createPendingApprovalTags());
                } else {
                    box.checked = false;
                    if (loadingSelector) loadingSelector.remove();
                }
            } else {
                box.checked = false;
                if (loadingSelector) loadingSelector.remove();
            }
            control?.classList.remove("is-loading");
        }

        editor.setValue(extension.code);
    }

    const channelPickers = <NodeListOf<HTMLElement>>document.querySelectorAll(Selectors.ExtensionChannelList)!;
    const rolePickers = <NodeListOf<HTMLElement>>document.querySelectorAll(Selectors.ExtensionRoleList)!;

    Promise.all([
        API.getAvailableChannels(API.guildID!),
        API.getAvailableRoles(API.guildID!, true),
        API.getGuildExtension(API.guildID!, API.extensionID!)
    ]).then(([channels, roles, extension]) => {
        channelPickers.forEach(loadPickers(true, channels));
        rolePickers.forEach(loadPickers(false, roles.filter(r => r.id !== API.guildID!)));
        setValues(extension);
        API.bindToSaveButton(data => {
            return API.updateGuildExtension(API.guildID!, API.extensionID!, data);
        }, saveButton, res => {
            setValues(res);
            if (API.extensionID === "new") {
                API.extensionID = res.id;
                globalThis.history.replaceState(null, "", `/dashboard/${API.guildID}/extensions/${API.extensionID}`);
            }
        }, dataCollector, () => API.extension!);
        API.bindToResetButton(resetButton, setValues, API.extension!);
    });
});