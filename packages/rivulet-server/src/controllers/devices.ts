import { NextFunction, Request, Response, Router } from 'express';
import Discovery from '../discovery';

const Devices: Router = Router();

Devices.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send(Array.from(Discovery.discoveredDevices.values()));
});

export default Devices;