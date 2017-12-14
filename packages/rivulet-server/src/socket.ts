import Discovery, { Device } from './discovery';
import { Server } from 'http';
import io from 'socket.io';
import { Episode } from '../typings/media';
import { fakeGOTEpisode } from './global/mock';
import { Chromecast } from './receivers/chromecast';
import { Receiver } from './receivers/Receiver';
import { error } from './services/log';
import chalk from 'chalk';

class Socket {
    io: SocketIO.Server;
    activeReceivers: Receiver[] = [];

    constructor (http: Server) {
        this.io = io(http);
    }

    bind () {
        Discovery.on('device-discovered', (device: Device) => {
            // this stuff is only in place to test stuff whilst there's no FE
            this.connect(device, fakeGOTEpisode);
            /////////////////////////////////////////////////////////////////

            return this.io.emit('device-discovered', device);

        });
        Discovery.on('device-left', (device: Device) => (
            this.io.emit('device-left', device)
        ));
        this.io.on('connect', () => this.connect);
    }

    connect (device: Device, episode: Episode) {
        let receiver: Receiver | null = null;
        if (device.type === 'chromecast' && device.name === 'Jari') {
            receiver = new Chromecast(device, episode, this, {
                username: 'jari2',
                password: '',
                id: '7122f28c-bacd-4d1e-af23-8d0f9845bfbe'
            });
        }

        if (!receiver) {
            error(chalk`No valid receiver for device type {cyan ${device.type}} found!`);
            return;
        }
        
        receiver.play();
        this.activeReceivers.push(receiver);
    };
}

export default Socket;