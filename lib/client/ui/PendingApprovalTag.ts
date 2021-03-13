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

export default function createPendingApprovalTags(): HTMLSpanElement {
    const isPendingApprovalTags = document.createElement("span");
    isPendingApprovalTags.classList.add("tags", "has-addons", "is-inline-flex", "requires-approval");

    {
        const loadingTag = document.createElement("span");
        loadingTag.classList.add("tag", "is-info", "is-marginless", "is-loading");
        
        const pendingApprovalTag = document.createElement("span");
        pendingApprovalTag.classList.add("tag", "is-info", "is-marginless");
        pendingApprovalTag.innerText = "Pending approval";

        isPendingApprovalTags.append(loadingTag, pendingApprovalTag);
    }

    return isPendingApprovalTags;
}