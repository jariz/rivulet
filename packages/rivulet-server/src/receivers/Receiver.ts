import Socket from '../socket';
import { Device } from '../discovery';
import { Episode } from '../../typings/media';
import { User } from '../../typings/models/user';

export class Receiver {
    device: Device;
    episode: Episode;
    socket: Socket;
    owner: User;
    
    constructor (device: Device, episode: Episode, socket: Socket, owner: User) {
        this.device = device;
        this.episode = episode;
        this.socket = socket;
        this.owner = owner;
    }
    
    play () {
        // should be overridden
    }
}