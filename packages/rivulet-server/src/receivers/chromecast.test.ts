import Discovery, { Device } from '../discovery';
import { fakeEpisodes, fakeUser } from '../constants/mock';
import Chromecast from './chromecast';
import { Status, Volume } from './Receiver';
import { debug } from '../services/log';
import cleanupTests from '../cleanupTests';

jest.setTimeout(30 * 1000);

const findDevice: Promise<Device> = new Promise((resolve, reject) => {
    const deviceFound = (currentDevice: Device) => {
        if (currentDevice.type !== 'chromecast' 
            || currentDevice.name !== 'Jari') {
            Discovery.once('device-discovered', deviceFound);
            return;
        }
        resolve(currentDevice);
    };

    Discovery.once('device-discovered', deviceFound);
});

let device: Device;
it('Discovers a device', async () => {
    expect.assertions(1);
    device = await findDevice;
    expect(device.type).toBe('chromecast');
});

let cast: Chromecast;
it('Connects to the device', async () => {
    cast = new Chromecast(device, fakeEpisodes, fakeUser);
    const status: Status = await cast.connect();
    expect(status.volume.level).toBeGreaterThan(0);
    expect(status.volume.muted).not.toBeTruthy();
    expect(status.skipPossible).toBeTruthy();
    expect(typeof status.currentTime).toBe('number');
    expect(status.paused).toBeFalsy();
});

it('Pauses', async () => {
    const status: Status = await cast.pause();
    expect(status.paused).toBeTruthy();
});

it('Resumes', async () => {
    const status: Status = await cast.play();
    expect(status.paused).toBeFalsy();
});

it('Seeks', async () => {
    const status: Status = await cast.seek(0);
    expect(status.currentTime).toBe(0);
});

it('Skips to the next episode', async () => {
    const status: Status = await cast.skip();
    debug('Skips to the next episode', status);
    expect(status.skipPossible).toBeTruthy();
});

it('Stops playback', async () => {
    const status: Status = await cast.stop();
    debug('Stops playback', status);
});

it('Changes volume', async () => {
    const volume: Volume = await cast.setVolume({
        level: 0.5
    });
    expect(volume.level).toBe(0.5);
});

it('Mutes volume', async () => {
    const volume: Volume = await cast.setVolume({
        muted: true
    });
    expect(volume.muted).toBeTruthy();
});

it('Cleans up', async () => {
    // todo find a way to do this globally...
    // every test is gonna have to call this
    cleanupTests();
});
