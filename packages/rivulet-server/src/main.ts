import express, { Express } from 'express';
import dotenv from 'dotenv';
import { error, info, warn } from './services/log';
import chalk from 'chalk';
import ip from 'ip';
import Discovery from './discovery';
import Devices from './controllers/devices';
import Socket from './socket';
import { Server as HttpServer } from 'http';
import createDBClient from './factories/createDBClient';
import createAuthHandler, { handler as authHandler } from './factories/createAuthHandler';
import Auth from './controllers/auth';
import loki from 'lokijs';
import createConfig from './factories/createConfig';
import Config from '../typings/config';
import bodyParser from 'body-parser';
import validVar from './global/validVar';
import Library from './controllers/library';

dotenv.config();

declare var __DEV__: boolean;

export class Server {
    public app: Express;
    public port: number;
    public db: loki;
    public config: Config;
    private socket: Socket;

    constructor () {
        this.app = express();
        this.port = this.getPort();
        if (!this.envsOK()) {
            error(chalk`Your env keys are incorrect.\r\nCopy {cyan .env.default} to {cyan .env} and enter a URL and API key for {underline Sonarr} and/or {underline Radarr}`);
            process.exit(1);
        }
        this.start().catch((err) => error('Unable to initialize!', err));
    }

    private envsOK (): boolean {
        return ['RADARR', 'SONARR'].some(type => validVar(`${type}_API_URL`) && validVar(`${type}_API_KEY`));
    }

    private async start () {
        Discovery.start();
        
        this.config = await createConfig();
        this.db = createDBClient();

        this.app.use(bodyParser.json());
        createAuthHandler();
        this.setRoutes();
        
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

    private setRoutes () {
        this.app.use('/auth', Auth);
        
        // everything else is authorized(!)
        this.app.use(authHandler);
        this.app.use('/devices', Devices);
        this.app.use('/library', Library);
    };
}

export default new Server();