// none of these are fully typed. add more if need be.

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

declare const ____srt2vtt: () => ReadWriteStream;
declare module 'srt-to-vtt' {
    export = ____srt2vtt
}

declare module 'castv2-client' {
    import { EventEmitter } from 'events';
    export type App = any; // todo type
    export type Status = {
        activeTrackIds: number[],
        
    };
    export interface QueueItem {
        
    }
    export interface Media {
        contentId: string,
        contentType: string,
        duration?: number,
        metadata: number,
    }

    export const DefaultMediaReceiver: App;
    export type LoadOpts = { autoplay?: boolean };
    export interface QueueOpts {
        startIndex?: number,
        currentTime?: number,
        repeatMode?: 'REPEAT_OFF' | 'REPEAT_ALL' | 'REPEAT_SINGLE' | 'REPEAT_ALL_AND_SHUFFLE' 
    }
    export type QueueUpdateOpts = QueueOpts & {
        jump?: number,
        currentItemId?: number
    };

    export class Player extends EventEmitter {
        load (media: any, opts: LoadOpts, cb: (err: Error, status: Status) => void): void;

        queueLoad (queue: QueueItem[], opts: QueueOpts, cb: (err: Error, status: Status) => void): void;

        queueUpdate (queue: QueueItem[], opts: QueueUpdateOpts, cb: (err: Error, status: Status) => void): void;
    }

    export class Client extends EventEmitter {
        connect (host: string, cb: () => void): void;

        launch (app: App, callback: (err: Error, player: Player) => void): void;

        close (): void;
    }
}