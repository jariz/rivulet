import { Client } from 'node-ssdp';
import { debug, error } from '../services/log';
import { DIAL, MEDIA_RENDERER } from '../global/serviceTypes';
import fetch from 'node-fetch';
import xml, { Element } from 'xml-js';
import chalk from 'chalk';

type DeviceType = 'chromecast' | 'mediarenderer';
type Device = {
    type: DeviceType,
    name: string,
    location: string
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
                .reduce((a: DeviceInfo, b: DeviceInfo) => Object.assign(a, b));
        });

class Discovery {
    discoveredDevices: DeviceMap = new Map();
    private client: Client;

    start () {
        this.client = new Client({
            customLogger: (...args: any[]) => debug(chalk`{red SSDP}`, ...args)
        });
        
        // possible chromecast device
        this.client.search(DIAL);
        // general media renderer
        this.client.search(MEDIA_RENDERER);
        
        this.client.on('response', this.onFound);
    }

    private onFound = async (headers: any, statusCode: number, rInfo: any) => {
        if (statusCode !== 200) {
            return;
        }
        try {
            switch (headers.ST) {
                case MEDIA_RENDERER: {
                    if (this.discoveredDevices.has(headers.USN)) {
                        return;
                    }
                    debug('Discovered media renderer', headers.LOCATION);
                    const deviceInfo = await getDeviceInfo(headers.LOCATION);
                    const name = deviceInfo.friendlyName || deviceInfo.modelName || 'Unknown device'
                    debug(chalk`Added new mediarenderer {bold ${name}}`);
                    this.discoveredDevices.set(headers.USN, {
                        name,
                        location: headers.LOCATION,
                        type: 'mediarenderer'
                    });
                    break;
                }
                case DIAL: {
                    if (this.discoveredDevices.has(headers.USN)) {
                        return;
                    }
                    debug('Discovered DIAL device', headers.LOCATION, 'checking if it\'s a gcast...');
                    const deviceInfo = await getDeviceInfo(headers.LOCATION);
                    if (deviceInfo.modelName === 'Eureka Dongle') {
                        const name = deviceInfo.friendlyName || deviceInfo.modelName || 'Unknown device'
                        debug(chalk`Added new gcast {bold ${name}}`);
                        this.discoveredDevices.set(headers.USN, {
                            name: deviceInfo.friendlyName || deviceInfo.modelName || 'Unknown device',
                            location: headers.LOCATION,
                            type: 'chromecast'
                        });
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
}

export default new Discovery();