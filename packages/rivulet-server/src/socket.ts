import Discovery, { Device } from './discovery';
import { Server } from 'http';
import io from 'socket.io';
import { Receiver } from './receivers/Receiver';

class Socket {
    io: SocketIO.Server;
    activeReceivers: Receiver[] = [];

    constructor (http: Server) {
        this.io = io(http);
    }

    bind () {
        Discovery.on('device-discovered', (device: Device) => this.io.emit('device-discovered', device));
        Discovery.on('device-left', (device: Device) => (
            this.io.emit('device-left', device)
        ));
        this.io.on('connect', () => this.connect);
    }

    connect () {
        // todo
    };
}

export default Socket;