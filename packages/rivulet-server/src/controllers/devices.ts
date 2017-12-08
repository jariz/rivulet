import express, { NextFunction, Request, Response, Router } from 'express';
import Discovery from '../discovery';

const Devices: Router = express.Router();

Devices.get('/devices', (req: Request, res: Response, next: NextFunction) => {
    res.send(Array.from(Discovery.discoveredDevices.values()));
});

export default Devices;