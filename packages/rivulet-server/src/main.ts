import express from 'express';
import dotenv from 'dotenv';
import { error, info, warn } from './services/log';
import chalk from 'chalk';
import ip from 'ip';
import Discovery from './discovery';
import Devices from './controllers/devices';
import Socket from './socket';
import { Server as HttpServer } from 'http';

declare var __DEV__: boolean;

export class Server {
    public app: express.Express;
    public port: number;
    private socket: Socket;

    constructor () {
        dotenv.config();
        this.app = express();
        this.port = this.getPort();
        if (!this.envsOK()) {
            error(chalk`Your env keys are incorrect.\r\nCopy {cyan .env.default} to {cyan .env} and enter a URL and API key for {underline Sonarr} and/or {underline Radarr}`);
            process.exit(1);
        }
        this.setRoutes();

        Discovery.start();
        this.start();
    }

    private envsOK (): boolean {
        const notEmpty = (_var: string) => _var in process.env && process.env[_var] !== '';
        return ['RADARR', 'SONARR'].some(type => notEmpty(`${type}_API_URL`) && notEmpty(`${type}_API_KEY`));
    }

    private start = (): void => {
        const http = new HttpServer(this.app);
        this.socket = new Socket(http);
        this.socket.bind();
        http.listen(this.port, this.onListen);
    };

    private onListen = (err: Error): void => {
        if (err) {
            error(`Unable to start server on port ${this.port}`, err);
            return;
        }

        if (__DEV__) {
            warn('We\'re in development mode.');
        }

        info(`We're live.\r\n`);
        info(chalk`{bold On your network:}     {underline http://${ip.address('public')}:{bold ${this.port.toLocaleString()}}/}`);
        info(chalk`Local:               {underline http://${ip.address('private')}:{bold ${this.port.toString()}}/}`);
    };

    private getPort = (): number => process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000;

    private setRoutes = (): void => {
        this.app.get('/devices', Devices);
    };
}

export default new Server().app;