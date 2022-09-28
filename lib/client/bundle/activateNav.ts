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

const doMenu = (links: NodeListOf<HTMLAnchorElement>) => {
    for (const link of links) {
        if (globalThis.location.pathname === "/") break;
        if (!link.href) continue;
        if (link.href === globalThis.location.href) {
            link.classList.add("is-active");
            break;
        } else {
            link.classList.remove("is-active");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const navbar = <HTMLElement>document.querySelector("nav.navbar");
    if (!navbar) return;
    const links = <NodeListOf<HTMLAnchorElement>>navbar.querySelectorAll("a.navbar-item");
    if (links) doMenu(links);

    const burger = <HTMLAnchorElement>navbar.querySelector("a.navbar-burger");
    if (!burger) return;
    if (!burger.dataset.target) return;
    const targetElement = document.getElementById(burger.dataset.target);
    if (!targetElement) return;
    
    burger.addEventListener("click", () => {
        burger.classList.toggle("is-active");
        targetElement.classList.toggle("is-active");
    });
});
