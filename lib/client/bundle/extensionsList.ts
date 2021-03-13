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

import createQuestionModal from "../ui/YesNoModal";
import createNotification from "../ui/Notification";
import API from "../ttBotAPI";

const extensions = <HTMLDivElement>document.querySelector("div.extension-list");
const extensionBoxes = <NodeListOf<HTMLElement>>extensions.querySelectorAll("article.media");

function deleteExtension(box: HTMLElement) {
    const { dataset: extensionData } = box;

    const irreversibleText = document.createElement("b");
    irreversibleText.innerText = "This action is irreversible!";

    const checkBoxLabel = document.createElement("label");
    checkBoxLabel.className = "checkbox";


    const checkBox = document.createElement("input");

    {
        checkBox.type = "checkbox";
        checkBox.id = `delete-store-${extensionData.id}`;

        const checkBoxLabelSpan = document.createElement("span");
        checkBoxLabelSpan.innerText = `Delete the extension store (ID: ${extensionData.store})`;

        checkBoxLabel.append(checkBox, checkBoxLabelSpan);
    }

    
    createQuestionModal(`Are you sure you want to delete ${extensionData.name} (${extensionData.id})?`, "Delete", ["is-danger"],
        "Cancel", [], async choice => {
            if (choice) {
                await API.deleteGuildExtension(API.guildID!, extensionData.id!, checkBox.checked);

                const extensionNameTag = document.createElement("b");
                extensionNameTag.innerText = extensionData.name!;

                const extensionIDTag = document.createElement("b");
                extensionIDTag.innerText = extensionData.id!;

                extensions.prepend(createNotification(10000, ["is-success"], "The extension ", extensionNameTag, " (", extensionIDTag, ") has been deleted."));

                box.remove();
            }
        }, irreversibleText, document.createElement("br"), checkBoxLabel);
}

for (const box of extensionBoxes) {
    const deleteButton = <HTMLButtonElement>box.querySelector("button.delete-extension");
    if (!deleteButton) continue;
    deleteButton.addEventListener("click", () => {
        deleteExtension(box);
    });
}
