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

export default function createNotification(timeout = 0, notificationClasses: string[], ...args: Parameters<ParentNode["append"]>): HTMLDivElement {
    const destroyNotification = () => void notification.remove();
    let timer: NodeJS.Timeout;

    const notification = document.createElement("div");
    notification.classList.add("notification", ...notificationClasses);

    {
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete";
        deleteButton.addEventListener("click", () => {
            destroyNotification();
            if (timer) clearTimeout(timer);
        });

        if (timeout) {
            timer = setTimeout(() => {
                destroyNotification();
            }, timeout);
        }
        notification.append(deleteButton, ...args);
    }

    return notification;
}
