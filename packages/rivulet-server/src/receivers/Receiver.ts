import Socket from '../socket';
import {Device} from '../discovery';
import {Episode} from '../../typings/media';

export class Receiver {
    device: Device;
    episode: Episode;
    socket: Socket;

    constructor(device: Device, episode: Episode, socket: Socket) {
        this.device = device;
        this.episode = episode;
        this.socket = socket;

        // TODO tmp till FE is in place
        if (device.type === 'mediarenderer') {
            this.init();
        }
    }

    init() {
        // overridden
    }
    
}