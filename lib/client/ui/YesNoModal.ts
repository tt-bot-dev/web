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

export default function createModal(title: string, yesCaption: string, yesButtonClasses: string[], noCaption: string, noButtonClasses: string[], cb: (choice: boolean) => void, ...body: Parameters<ParentNode["append"]>): void {
    const destroyModalCallback = (modal: HTMLDivElement, modalCard: HTMLDivElement, modalBg: HTMLDivElement) => {
        modalCard.classList.remove("tttie-slide-in");
        modalCard.classList.add("tttie-slide-out");
        modalBg.classList.add("tttie-fade-out");

        if (globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            modal.remove();
            return;
        }

        modalCard.addEventListener("animationend", () => {
            modal.remove();
        }, {
            once: true,
        });
    };

    {
        const modal = document.createElement("div");
        modal.classList.add("modal", "is-active", "tttie-fade-in");
        
        {
            const modalBg = document.createElement("div");
            modalBg.classList.add("modal-background");
        
            const modalCard = document.createElement("div");
            modalCard.classList.add("modal-card", "tttie-slide-in");

            {
                const modalHeader = document.createElement("header");
                modalHeader.classList.add("modal-card-head");

                {
                    const modalHeaderLabel = document.createElement("p");
                    modalHeaderLabel.classList.add("modal-card-title");
                    modalHeaderLabel.innerText = title;
                    modalHeader.append(modalHeaderLabel);
                }

                const modalBody = document.createElement("section");
                modalBody.classList.add("modal-card-body");

                {
                    modalBody.append(...body);
                }

                const modalFooter = document.createElement("footer");
                modalFooter.classList.add("modal-card-foot");

                {
                    const yesButton = document.createElement("button");
                    yesButton.classList.add("button", ...yesButtonClasses);
                    
                    {
                        yesButton.innerText = yesCaption;
                        yesButton.addEventListener("click", () => {
                            cb(true);
                            destroyModalCallback(modal, modalCard, modalBg);
                        });
                    }

                    const noButton = document.createElement("button");
                    noButton.classList.add("button", ...noButtonClasses);

                    {
                        noButton.innerText = noCaption;
                        noButton.addEventListener("click", () => {
                            cb(false);
                            destroyModalCallback(modal, modalCard, modalBg);
                        });
                    }

                    modalFooter.append(yesButton, noButton);
                }

                modalCard.append(modalHeader, modalBody, modalFooter);
            }

            modal.append(modalBg, modalCard);
        }

        document.body.append(modal);
    }
}
