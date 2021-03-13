// Typings for @polka/* packages

import type { OutgoingHttpHeaders, ServerResponse } from "http";
import type { Stream } from "stream";

declare module "@polka/send-type" {
    export default function send(res: ServerResponse, code: number, data: Buffer | Stream | Record<string, unknown> | string, headers: OutgoingHttpHeaders): void;
}
declare module "@polka/redirect" {
    export default function redirect(res: ServerResponse, code?: number, location?: string): void;
    export default function redirect(res: ServerResponse, location?: string): void;
}