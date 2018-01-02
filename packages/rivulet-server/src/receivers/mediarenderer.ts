import { Receiver, Status, Volume } from './Receiver';
import MediaRendererClient, { MediaRendererOptions } from 'upnp-mediarenderer-client';
import { serveFileUrl } from '../constants/urls';
import util from 'util';
import { debug } from '../services/log';

export class MediaRenderer extends Receiver {
    client: MediaRendererClient;
    queueIndex: number;

    onStatus (status: any) {
        debug('mediarenderer onstatus', status);
    }

    async pause () {
        const pause = util.promisify<Status>(this.client.pause.bind(this.client));
        const status = await pause();
        debug('mediarenderer paused', status);
        return status;
    }

    async stop () {
        const stop = util.promisify<Status>(this.client.stop.bind(this.client));
        const status = await stop();
        debug('mediarenderer stopped', status);
        return status;
    }
    
    async seek (time: number) {
        const seek = util.promisify<number, Status>(this.client.stop.bind(this.client));
        const status = await seek(time);
        debug(`mediarenderer seeked to ${time}`, status);
        return status;
    }

    async play () {
        const play = util.promisify<Status>(this.client.play.bind(this.client));
        const status = await play();
        debug('mediarenderer playing', status);
        return status;
    }

    async skip () {
        if (!(this.queueIndex + 1 in this.queue)) {
            throw new Error('Skip not possible')
        }
        
        this.queueIndex++;
        return await this.load();
    }

    async setVolume (volume: Volume) {
        let { level, muted } = volume;
        if (muted || !level) {
            level = 0;
        }
        const setVolume = util.promisify<number, Status>(this.client.setVolume.bind(this.client));
        // todo find out whether setVolume returns a status or not
        // eitherway, it needs to be normalized to a Volume object
        const status: any = await setVolume(level);
        debug(`mediarenderer volume changed to to ${level}`, status);
        return status;
    }

    async connect () {
        this.queueIndex = 0;
        this.client = new MediaRendererClient(this.device.location);
        this.client.on('status', this.onStatus);

        return await this.load();
    }

    private async load () {
        const { episodeFile, title } = this.queue[this.queueIndex];
        const load = util.promisify<string, MediaRendererOptions, Status>(this.client.load.bind(this.client));
        const status = await load(serveFileUrl(episodeFile.id, episodeFile.path), {
            autoplay: true,
            contentType: 'video/mp4',
            metadata: {
                title: title,
                creator: 'Thomas',
                type: 'video'
                // subtitles dont work atm, see
                // https://gist.github.com/thibauts/5f5f8d8ce6566c8289e6
                // for the headers the srt server should send
                // and https://www.npmjs.com/package/upnp-mediarenderer-client
                // for more info
                // subtitlesUrl: ''
            }
        });

        // if (err) {
        //     switch (err.errorCode) {
        //         case 716:
        //             return error('Media not found. ');
        //
        //         default:
        //             return error(err);
        //     }
        // }

        return status;
    }
}