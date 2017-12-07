import express, { NextFunction, Request, Response, Router } from 'express';
import Discovery from '../receivers/discovery';

const Devices: Router = express.Router();

Devices.get('/devices', (req: Request, res: Response, next: NextFunction) => {
    res.send(
        Array.from(Discovery.discoveredDevices.entries())
            .map(([key, val]) => ({
                [key]: val
            }))
            .reduce((a, b) => Object.assign(a, b), [])
    );
});

export default Devices;