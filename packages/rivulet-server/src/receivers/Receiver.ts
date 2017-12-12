import Socket from '../socket';
import { Device } from '../discovery';
import { Episode } from '../../typings/media';

export class Receiver {
    device: Device;
    episode: Episode;
    socket: Socket;
    
    constructor (device: Device, episode: Episode, socket: Socket) {
        this.device = device;
        this.episode = episode;
        this.socket = socket;
    }
    
    play () {
        // should be overridden
    }
}