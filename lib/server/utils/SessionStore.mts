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

import type { DBProvider } from "@tt-bot-dev/types";
import type { Logger } from "sosamba";
import type { SessionData, Store } from "express-session";

// Is a no-op on purpose
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop(): void {}

export interface _Store {
    new (db: DBProvider, logger: Logger): Store;
}

export default function(session: typeof import("express-session")): _Store {
    return class SessionStore extends session.Store {
        private sessionClearInterval = setInterval(() => {
            this.db.purgeSessions()
                .then(null, err => {
                    this.logger.warn(`Couldn't purge the sessions:\n${err.stack}`);
                });
        }, 60000);
        constructor(private db: DBProvider, private logger: Logger) {
            super();
        }

        get(sessionID: string, cb: (err: unknown, session?: SessionData | null) => void = noop) {
            return this.db.getSession<SessionData>(sessionID)
                .then(sess => {
                    if (!sess) return cb(null, null);
                    if (Date.now() >= sess.expires) {
                        this.db.removeSession(sessionID).then(null, err => {
                            this.logger.warn(`Couldn't delete session ${sessionID}:\n${err.stack}`);
                        });
                        return cb(null, null);
                    }
                    cb(null, sess.data);
                });
        }

        set(sessionID: string, session: SessionData, cb: (err: unknown) => void = noop) {
            return this.db.setSession(sessionID, {
                expires: Date.now() + (session.cookie.originalMaxAge || 86400000),
                data: session
            }).then(() => {
                cb(null);
            }, err => {
                cb(err);
            });
        }

        destroy(sessionID: string, cb: (err: unknown) => void = noop) {
            return this.db.removeSession(sessionID)
                .then(() => {
                    cb(null);
                }, err => {
                    cb(err);
                });
        }
    };
}