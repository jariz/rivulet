import * as express from 'express';
import dotenv from 'dotenv';
import { error, info, warn } from './services/log';
import chalk from 'chalk';
import ip from 'ip';

declare var __DEV__: boolean;

export class Server {
    public app: express.Express;
    public port: number;

    constructor () {
        dotenv.config();
        this.app = express();
        this.port = this.getPort();
        if (!this.envsOK()) {
            error(chalk`Your env keys are incorrect.\r\nCopy {cyan .env.default} to {cyan .env} and enter a URL and API key for {underline Sonarr} and/or {underline Radarr}`);
            process.exit(1);
        }
        this.setRoutes();
        this.start();
    }

    private envsOK (): boolean {
        const notEmpty = (_var: string) => _var in process.env && _var !== '';
        return ['RADARR', 'SONARR'].some(type => notEmpty(`${type}_API_URL`) && notEmpty(`${type}_API_KEY`));
    }

    private start = (): void => {
        this.app.listen(this.port, this.onListen);
    };

    private onListen = (err: any): void => {
        if (err) {
            console.error(err);
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
        this.app.get('/', this.getHomepage);
    };

    private async getHomepage (req: express.Request, res: express.Response): Promise<express.Response> {
        try {
            const thing = await Promise.resolve({ one: 'two' });
            return res.json({ ...thing, hello: 'world' });
        } catch (e) {
            return res.json({ error: e.message });
        }
    };
}

export default new Server().app;