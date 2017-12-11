// none of these are fully typed. add more if need be.

import WritableStream = NodeJS.WritableStream;
import ReadWriteStream = NodeJS.ReadWriteStream;

type Name = string | 'public' | 'private'
type Family = 'ipv4' | 'ipv6'

declare module 'ip' {
    export function address (name?: Name, family?: Family): string
}

type SsdpOpts = {
    // https://github.com/diversario/node-ssdp#configuration
    customLogger?: (...args: any[]) => void
}

declare module 'node-ssdp' {
    import EventEmitter = NodeJS.EventEmitter;

    export class Client extends EventEmitter {
        constructor (opts?: SsdpOpts);

        search (serviceType: string): string;
    }
}

type CallSite = {
    getMethodName: () => string;
    getFunctionName: () => string;
}

declare module 'stack-trace' {
    export function get (): CallSite[];
}

declare const ____srt2vtt: () => ReadWriteStream
declare module 'srt-to-vtt' {
    export = ____srt2vtt
} 

declare module 'stream-transcoder' {
    const st: any
    export = st
}