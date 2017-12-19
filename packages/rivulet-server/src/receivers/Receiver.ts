import { Device } from '../discovery';
import { Episode } from '../../typings/media';
import { User } from '../../typings/models/user';
import { EventEmitter } from 'events';

export interface Status {
    currentTime: number;
    volume: number;
    paused: boolean;
    skipPossible: boolean;
}

export abstract class Receiver extends EventEmitter {
    constructor (protected _device: Device, protected _episode: Episode, protected _owner: User) {
        super();
    }

    get device () {
        return this._device;
    }

    set device (value: Device) {
        this._device = value;
    }

    get owner () {
        return this._owner;
    }

    set owner (value: User) {
        this._owner = value;
    }

    get episode () {
        return this._episode;
    }

    set episode (value: Episode) {
        this._episode = value;
    }
    
    abstract connect (): Promise<Status>;
    
    abstract play (): Promise<void>;
    abstract pause (): Promise<void>;
    abstract stop (): Promise<void>;
    abstract seek (time: number): Promise<void>;
    abstract skip (): Promise<void>;
}