import {Client} from 'node-ssdp';
import {debug, error} from './services/log';
import fetch from 'node-fetch';
import xml, {Element} from 'xml-js';
import chalk from 'chalk';
import {EventEmitter} from 'events';
import {DIAL, MEDIA_RENDERER} from './global/serviceTypes';

type DeviceType = 'chromecast' | 'mediarenderer';
export type Device = {
    usn: string;
    type: DeviceType;
    deviceInfo: any;
    name: string;
    location: string;
};
type DeviceMap = Map<string, Device>;
type DeviceInfo = { [K: string]: string };

const getDeviceInfo = (url: string): Promise<DeviceInfo> =>
    fetch(url)
        .then(resp => resp.text())
        .then(text => xml.xml2js(text).elements[0])
        .then((element: Element) => element.elements!.find((childElement: Element) => childElement.name === 'device'))
        .then((element?: Element) => {
            if (!element) {
                throw new Error('Unable to get device info: no device element found');
            }
            return element;
        })
        .then((element: Element) => {
            if (!element.elements) {
                throw new Error('Unable to get device info: device element did not contain any children');
            }
            return element.elements
                .filter(childElement => !!childElement.elements)
                .filter(childElement => childElement.elements!.every(childChildElement => childChildElement.type === 'text'))
                .map((childElement: Element) => {
                    return ({
                        [childElement.name!]: childElement.elements![0].text!.toString()
                    });
                })
                .reduce((a: DeviceInfo, b: DeviceInfo) => Object.assign(a, b), {});
        });

class Discovery extends EventEmitter {
    discoveredDevices: DeviceMap = new Map();
    private previouslyDiscoveredDevices: DeviceMap = new Map();
    private client: Client;

    constructor() {
        super();
        this.start();
    }

    start() {
        this.client = new Client({
            customLogger: (...args: any[]) => debug(chalk`{black {bgRed  SSDP }}`, ...args)
        });

        setInterval(() => this.search(), 1000 * 60);
        this.search();
        this.client.on('response', this.onFound);
    }

    search() {
        debug('Initiating SSDP discovery...');
        this.previouslyDiscoveredDevices = new Map(this.discoveredDevices);
        this.discoveredDevices = new Map();

        // possible chromecast device
        this.client.search(DIAL);
        // general media renderer
        this.client.search(MEDIA_RENDERER);

        // give devices 5 seconds to reply, otherwise assume they 'left'
        setTimeout(() => this.findLeft(), 5000);
    }

    private onFound = async (headers: any, statusCode: number, rInfo: any) => {
        if (statusCode !== 200) {
            return;
        }

        if (this.previouslyDiscoveredDevices.has(headers.USN)) {
            const dev = this.previouslyDiscoveredDevices.get(headers.USN)!;
            this.discoveredDevices.set(dev.usn, dev);
            return;
        }

        try {
            switch (headers.ST) {
                case MEDIA_RENDERER: {
                    debug('Discovered media renderer', headers.LOCATION);
                    const deviceInfo = await getDeviceInfo(headers.LOCATION);
                    this.addDevice(headers, deviceInfo, 'mediarenderer');
                    break;
                }
                case DIAL: {
                    debug('Discovered DIAL device', headers.LOCATION, 'checking if it\'s a gcast...');
                    const deviceInfo = await getDeviceInfo(headers.LOCATION);
                    if (deviceInfo.modelName === 'Eureka Dongle') {
                        this.addDevice(headers, deviceInfo, 'chromecast');
                    } else {
                        debug(chalk`Device found is a {bold ${deviceInfo.modelName}}, not a gcast, skipping!`);
                    }
                    break;
                }
                default:
                    return;
            }
        } catch (ex) {
            error(`Device discovery failed for device ${headers.USN}`, ex);
        }
    };

    private findLeft() {
        // detect devices that aren't here anymore
        const leftDevices: DeviceInfo[] = Array.from(this.previouslyDiscoveredDevices.keys())
            .filter(deviceKey => (
                !Array.from(this.discoveredDevices.keys()).find(key => deviceKey === key)
            ))
            .map(key => this.previouslyDiscoveredDevices.get(key)!);

        for (const device of leftDevices) {
            debug(chalk`Did not hear back again from {bold ${device.name}} in a timely manner, assuming it left...`);
            this.emit('device-left', device);
        }
    }

    private addDevice(headers: any, deviceInfo: any, type: Device['type']) {
        const name = deviceInfo.friendlyName || deviceInfo.modelName || 'Unknown device';
        const device: Device = {
            usn: headers.USN,
            name,
            location: headers.LOCATION,
            deviceInfo,
            type
        };
        this.emit('device-discovered', device);
        this.discoveredDevices.set(headers.USN, device);
        debug(chalk`Added new ${type} {bold ${name}} {dim ${headers.USN}}`);
    }
}

export default new Discovery();