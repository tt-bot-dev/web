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

export default function createCookieConsent(): void {
    const cookieConsentEl = document.createElement("section");
    cookieConsentEl.className = "section";
    {
        const container = document.createElement("div");
        container.className = "container";
        
        {
            const level = document.createElement("div");
            level.className = "level";

            {
                const levelLeft = document.createElement("div");
                levelLeft.className = "level-left";

                {
                    const levelLeftItem = document.createElement("div");
                    levelLeftItem.className = "level-item";

                    {
                        const p = document.createElement("p");
                        
                        {
                            const t = "We make use of cookies in order to provide tt.bot's web panel. ";

                            const a = document.createElement("a");
                            a.href = "https://tttie.cz/privacy/tt.bot.html";
                            a.innerText = "Learn more";

                            p.append(t, a);
                        }

                        levelLeftItem.append(p);
                    }

                    levelLeft.append(levelLeftItem);
                }

                const levelRight = document.createElement("div");
                levelRight.className = "level-right";

                {
                    const levelRightItem = document.createElement("div");
                    levelRightItem.className = "level-item";

                    {
                        const buttons = document.createElement("div");
                        buttons.className = "buttons";
                        
                        {
                            const buttonYes = document.createElement("button");
                            buttonYes.classList.add("button", "is-primary");

                            buttonYes.addEventListener("click", () => {
                                localStorage.setItem("tt.bot::hasConsentedToCookies", "true");
                                cookieConsentEl.remove();
                            });

                            {
                                const buttonYesIconSpan = document.createElement("span");
                                buttonYesIconSpan.className = "icon";

                                {
                                    const buttonYesIcon = document.createElement("i");
                                    buttonYesIcon.classList.add("fas", "fa-check");

                                    buttonYesIconSpan.append(buttonYesIcon);
                                }

                                const buttonYesSpan = document.createElement("span");
                                buttonYesSpan.innerText = "OK";

                                buttonYes.append(buttonYesIconSpan, buttonYesSpan);
                            }
                            
                            buttons.append(buttonYes);
                        }

                        {
                            const buttonNo = document.createElement("button");
                            buttonNo.classList.add("button", "is-danger");
                            buttonNo.addEventListener("click", () => {
                                globalThis.history.back();
                            });

                            {
                                const buttonNoIconSpan = document.createElement("span");
                                buttonNoIconSpan.className = "icon";

                                {
                                    const buttonNoIcon = document.createElement("i");
                                    buttonNoIcon.classList.add("fas", "fa-times");

                                    buttonNoIconSpan.append(buttonNoIcon);
                                }

                                const buttonNoSpan = document.createElement("span");
                                buttonNoSpan.innerText = "No";

                                buttonNo.append(buttonNoIconSpan, buttonNoSpan);
                            }
                        }

                        levelRightItem.append(buttons);
                    }
                    levelRight.append(levelRightItem);
                }

                level.append(levelLeft, levelRight);
            }

            container.append(level);
        }
        cookieConsentEl.append(container);
    }

    document.body.prepend(cookieConsentEl);
}
