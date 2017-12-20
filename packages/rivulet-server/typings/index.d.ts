// none of these are fully typed. add more if need be.

import ReadWriteStream = NodeJS.ReadWriteStream;

declare module 'ip' {
    type Name = string | 'public' | 'private'
    type Family = 'ipv4' | 'ipv6'

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

        stop (): void;
    }
}

declare const ____srt2vtt: () => ReadWriteStream;
declare module 'srt-to-vtt' {
    export = ____srt2vtt
}

declare module 'castv2-client' {
    import { EventEmitter } from 'events';
    type App = any; // todo type
    type RepeatMode = 'REPEAT_OFF' | 'REPEAT_ALL' | 'REPEAT_SINGLE' | 'REPEAT_ALL_AND_SHUFFLE';

    // https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.Volume
    export type Volume = {
        level: number,
        muted: boolean
    }

    // https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.MediaStatus
    export type Status = {
        activeTrackIds?: number[],
        currentItemId?: number;
        currentTime: number;
        idleReason: 'CANCELLED' | 'INTERRUPTED' | 'FINISHED' | 'ERROR' | undefined;
        items?: QueueItem[];
        loadingItemId?: number
        media?: Media;
        mediaSessionId: number;
        playbackRate: number;
        playerState: 'IDLE' | 'PLAYING' | 'PAUSED' | 'BUFFERING';
        preloadedItemId?: number;
        queueData?: QueueOpts;
        repeatMode: RepeatMode;
        supportedMediaCommands: number;
        type: string;
        videoInfo: VideoInfo;
        volume: Volume;
    };

    // https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.VideoInformation.html
    export interface VideoInfo {
        hdrType?: 'SDR' | 'HDR' | 'DV';
        width: number;
        height: number;
    }

    // https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media.QueueItem
    export interface QueueItem {
        activeTrackIds?: number[];
        autoplay?: boolean;
        customData?: any;
        itemId?: number;
        media?: Media;
        playbackDuration?: number;
        preloadTime?: number;
        startTime?: number;
    }

    // https://developers.google.com/cast/docs/reference/caf_receiver/cast.framework.messages.MediaInformation
    export interface Media {
        contentId: string;
        contentType: string;
        duration?: number;
        metadata: GenericMetadata;
        customData?: any;
        entity?: string;

    }

    // https://developers.google.com/cast/docs/reference/receiver/cast.receiver.media#.MetadataType
    export enum MetadataType {
        GENERIC = 0,
        MOVIE = 1,
        TV_SHOW = 2,
        MUSIC_TRACK = 3,
        PHOTO = 4
    }

    // https://developers.google.com/cast/docs/reference/caf_receiver/cast.framework.messages.MediaMetadata
    export interface Metadata {
        type: MetadataType
    }

    export interface GenericMetadata extends Metadata {
        type: MetadataType.GENERIC;
        releaseDate?: string;
        subtitle?: string;
        title?: string;
    }

    export const DefaultMediaReceiver: App;
    export type LoadOpts = { autoplay?: boolean };

    export interface QueueOpts {
        startIndex?: number,
        startTime?: number,
        currentTime?: number,
        repeatMode?: RepeatMode;
    }

    export type QueueUpdateOpts = QueueOpts & {
        jump?: number,
        currentItemId?: number
    };

    export class Player extends EventEmitter {
        load (media: Media, opts: LoadOpts, cb: (err: Error, status: Status) => void): void;

        play (callback: (err: Error, status: Status) => void): void;

        pause (callback: (err: Error, status: Status) => void): void;

        stop (callback: (err: Error, status: Status) => void): void;

        seek (currentTime: number, callback: (err: Error, status: Status) => void): void;

        queueLoad (queue: QueueItem[], opts: QueueOpts, cb: (err: Error, status: Status) => void): void;

        queueUpdate (queue: QueueItem[], opts: QueueUpdateOpts, cb: (err: Error, status: Status) => void): void;
    }

    export class Client extends EventEmitter {
        connect (host: string, cb: () => void): void;

        launch (app: App, callback: (err: Error, player: Player) => void): void;

        close (): void;
    }
}