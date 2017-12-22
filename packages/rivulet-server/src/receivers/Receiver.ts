import { Device } from '../discovery';
import { Episode } from '../../typings/media';
import { User } from '../../typings/models/user';
import { EventEmitter } from 'events';

export interface Volume {
    level?: number,
    muted?: boolean
};

export interface Status {
    currentTime: number;
    volume: Volume;
    paused: boolean;
    loading: boolean;
    skipPossible: boolean;
}

export abstract class Receiver extends EventEmitter {
    constructor (protected device: Device, protected episode: Episode, protected owner: User) {
        super();
    }
    
    abstract connect (): Promise<Status>;
    abstract play (): Promise<Status>;
    abstract pause (): Promise<Status>;
    abstract stop (): Promise<Status>;
    abstract seek (time: number): Promise<Status>;
    abstract skip (): Promise<Status>;
    abstract setVolume (volume: Volume): Promise<Volume>;
}