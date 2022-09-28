// Typings for @polka/* packages

import type { OutgoingHttpHeaders, ServerResponse } from "http";
import type { Response } from "express";
import type { Stream } from "stream";

declare module "@polka/send-type" {
    export default function send(res: ServerResponse | Response, code: number, data: Buffer | Stream | Record<string, unknown> | string, headers: OutgoingHttpHeaders): void;
}
declare module "@polka/redirect" {
    export default function redirect(res: ServerResponse | Response, code?: number, location?: string): void;
    export default function redirect(res: ServerResponse | Response, location?: string): void;
}
