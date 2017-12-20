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
    constructor (protected device: Device, protected episode: Episode, protected owner: User) {
        super();
    }
    
    abstract connect (): Promise<Status>;
    
    abstract play (): Promise<void>;
    abstract pause (): Promise<void>;
    abstract stop (): Promise<void>;
    abstract seek (time: number): Promise<void>;
    abstract skip (): Promise<void>;
}