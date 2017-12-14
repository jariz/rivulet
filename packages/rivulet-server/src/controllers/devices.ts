import { NextFunction, Request, Response, Router } from 'express';
import Discovery from '../discovery';
import { Controllers, devicesUrl, relative } from '../global/urls';

const Devices: Router = Router();

Devices.get(relative(devicesUrl(), Controllers.Devices), (req: Request, res: Response, next: NextFunction) => {
    res.send(Array.from(Discovery.discoveredDevices.values()));
});

export default Devices;