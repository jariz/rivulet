import Discovery, { Device } from './discovery';
import { Server } from 'http';
import io from 'socket.io';
import { Episode } from '../typings/media';
import { fakeGOTEpisode } from './global/mock';
import { Chromecast } from './receivers/chromecast';
import { Receiver } from './receivers/Receiver';

class Socket {
    io: SocketIO.Server;
    activeReceivers: Receiver[]

    constructor (http: Server) {
        this.io = io(http);
    }

    bind () {
        Discovery.on('device-discovered', (device: Device) => {
            // this stuff is only in place to test stuff whilst there's no FE
            this.connect(device, fakeGOTEpisode)
            /////////////////////////////////////////////////////////////////
            
            return this.io.emit('device-discovered', device);
            
        });
        Discovery.on('device-left', (device: Device) => (
            this.io.emit('device-left', device)
        ));
        this.io.on('connect', this.connect);
    }

    private connect = (device: Device, episode: Episode) => {
        if (device.type === 'chromecast') {
            new Chromecast(device, episode, this);
        }
    };
}

export default Socket;