import express, { Express } from 'express';
import dotenv from 'dotenv';
import { error, info, warn } from './services/log';
import chalk from 'chalk';
import ip from 'ip';
import Devices from './controllers/devices';
import Socket from './socket';
import { Server as HttpServer } from 'http';
import createAuthHandler, { handler as authHandler } from './factories/createAuthHandler';
import Auth from './controllers/auth';
import bodyParser from 'body-parser';
import validVar from './constants/validVar';
import Library from './controllers/library';
import Discovery from './discovery';
import { Controllers } from './constants/urls';

dotenv.config();

declare var __DEV__: boolean;

export class Server {
    public app: Express;
    public port: number;
    private socket: Socket;

    public getPort = (): number => process.env.PORT ? parseInt(process.env.PORT!, 10) : 3000;

    constructor () {
        this.app = express();
        this.port = this.getPort();
        if (!this.envsOK()) {
            error(chalk`Your env keys are incorrect.\r\nCopy {cyan .env.default} to {cyan .env} and enter a URL and API key for {underline Sonarr} and/or {underline Radarr}`);
            process.exit(1);
        }

        this.start();
    }

    public start () {
        Discovery.start();

        this.app.use(bodyParser.json());
        createAuthHandler();
        this.setRoutes();

        const http = new HttpServer(this.app);
        this.socket = new Socket(http);
        this.socket.bind();
        http.listen(this.port, this.onListen);
    };

    private envsOK (): boolean {
        return ['RADARR', 'SONARR'].some(type => validVar(`${type}_API_URL`) && validVar(`${type}_API_KEY`));
    }

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

    private setRoutes () {
        this.app.use(Controllers.Auth, Auth);

        // everything else is authorized(!)
        this.app.use(authHandler);
        this.app.use(Controllers.Devices, Devices);
        this.app.use(Controllers.Library, Library);
    };
}

export default new Server();