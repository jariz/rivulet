import Chromecast from './src/receivers/chromecast';
import Discovery, { Device } from './src/discovery';
import { fakeEpisode } from './src/constants/mock';
import { User } from './typings/models/user';
import uuid from 'uuid/v4';
import db from './src/sources/db';

require('./src/main');

const findDevice: Promise<Device> = new Promise((resolve, reject) => {
    const deviceFound = (currentDevice: Device) => {
        if (currentDevice.type !== 'chromecast' || currentDevice.name !== 'Jari') {
            Discovery.once('device-discovered', deviceFound);
            return;
        }
        resolve(currentDevice);
    };

    Discovery.once('device-discovered', deviceFound);
});

let user: User;
it('Creates a fake account to authorize chromecast requests', async () => {
    expect.assertions(1);

    const collection = await db.getCollection<User>('users');
    user = await collection.insertOne({
        id: uuid(),
        username: 'mocky',
        password: uuid()
    })!;

    expect(user).not.toBeNull();
});

let device: Device;
it('Discovers a device', async () => {
    expect.assertions(1);
    device = await findDevice;
    expect(device.type).toBe('chromecast');
});

it('Connects to the device', async () => {
    expect.assertions(1);
    return new Chromecast(device, fakeEpisode, user);
});

it('Cleans up the account again', async () => {
    const collection = await db.getCollection<User>('users');
    collection.removeWhere({ id: user.id });
});
