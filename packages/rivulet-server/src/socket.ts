import Discovery, { Device } from './discovery';
import { Server } from 'http';
import io from 'socket.io';

class Socket {
    io: SocketIO.Server;

    constructor (http: Server) {
        this.io = io(http);
    }
    
    bind () {
        Discovery.on('device-discovered', (device: Device) => (
            this.io.emit('device-discovered', device)
        ));
        Discovery.on('device-left', (device: Device) => (
            this.io.emit('device-left', device)
        ));
    }
}

export default Socket