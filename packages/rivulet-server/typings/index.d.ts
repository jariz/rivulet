// none of these are fully typed. add more if need be.

import ReadWriteStream = NodeJS.ReadWriteStream;

type Name = string | 'public' | 'private'
type Family = 'ipv4' | 'ipv6'

declare module 'ip' {
    export function address(name?: Name, family?: Family): string
}

type SsdpOpts = {
    // https://github.com/diversario/node-ssdp#configuration
    customLogger?: (...args: any[]) => void
}

declare module 'node-ssdp' {
    import EventEmitter = NodeJS.EventEmitter;

    export class Client extends EventEmitter {
        constructor(opts?: SsdpOpts);

        search(serviceType: string): string;
    }
}

// TODO better typings
declare module 'upnp-mediarenderer-client' {
    const MediaRendererClient: any;
    export = MediaRendererClient;
}

type CallSite = {
    getMethodName: () => string;
    getFunctionName: () => string;
}

declare module 'stack-trace' {
    export function get(): CallSite[];
}

declare const ____srt2vtt: () => ReadWriteStream
declare module 'srt-to-vtt' {
    export = ____srt2vtt
}

declare module 'castv2-client' {
    import {EventEmitter} from 'events';
    export type App = any;
    export const DefaultMediaReceiver: App;
    export type LoadOpts = { autoplay?: boolean };

    export class Player extends EventEmitter {
        load(media: any, opts: LoadOpts, cb: (err: Error, status: any) => void): void;
    }

    export class Client extends EventEmitter {
        connect(host: string, cb: () => void): void;

        launch(app: App, callback: (err: Error, player: Player) => void): void;

        close(): void;
    }
}