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

export type ErrorObject = { error: Error };

export default class Cache<V> {
    public _cache: Record<string, {
        time: number,
        data: V
    } & Partial<ErrorObject>> = {};

    private _fetching: Record<string, Promise<V>> = {};

    constructor(private resetTime: number,
        private getter: (key: string, cache: Cache<V>) => Promise<V | ErrorObject>,
        private cleaner: (err: Error, addl: unknown) => Promise<void>) {}

    remove(item?: string): void {
        if (item) delete this._cache[item];
    }

    get(item: string, addl: unknown, reCache = true): Promise<V> {
        if (this._cache[item]) {
            if ((this._cache[item] as ErrorObject).error) {
                // Intended no-op
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                this._fetch(item, addl).catch(() => {});
                return Promise.resolve(this._cache[item].data);
            }
            if (Date.now() - this._cache[item].time < this.resetTime) {
                return Promise.resolve(this._cache[item].data);
            }

            // Intended no-op
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (reCache) this._fetch(item, addl).catch(() => {});
            return Promise.resolve(this._cache[item].data);
        }
        return this._fetch(item, addl);
    }
    
    _fetch(item: string, addl: unknown): Promise<V> {
        if (this._fetching[item] !== undefined) {
            return this._fetching[item];
        }
        return this._fetching[item] = this.getter(item, this).then(data => {
            if ((data as ErrorObject).error) {
                console.error((data as ErrorObject).error); // eslint-disable-line no-console

                // Intended no-op
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                this.cleaner((data as ErrorObject).error, addl).catch(() => {});
                delete this._fetching[item];
                throw (data as ErrorObject).error;
            }
            this._cache[item] = { time: Date.now(), data } as { time: number, data: V };
            delete this._fetching[item];
            return data as V;
        });
    }
    
    clear(): void {
        this._cache = {};
    }
}
