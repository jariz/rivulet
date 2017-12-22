import { Receiver, Status } from './Receiver';
import {
    App,
    Client,
    DefaultMediaReceiver,
    Player,
    QueueItem,
    QueueOpts,
    QueueUpdateOpts,
    Status as ChromecastStatus,
    Volume
} from 'castv2-client';
import { debug, error } from '../services/log';
import { default as url, URL } from 'url';
import chalk from 'chalk';
import fetchJSON from '../services/fetchJSON';
import { episodesUrl } from '../constants/apiUrls';
import { Episode } from '../../typings/media';
import util from 'util';
import { Device } from '../discovery';
import { base, serveTranscodedFileUrl } from '../constants/urls';
import path from 'path';
import { sign } from 'jsonwebtoken';
import config from '../sources/config';
import { User } from '../../typings/models/user';

export default class Chromecast extends Receiver {
    client: Client;
    host: string;
    status?: ChromecastStatus;
    player?: Player;

    constructor (device: Device, episode: Episode, owner: User) {
        super(device, episode, owner);
        const { hostname } = new URL(device.location);
        this.host = hostname;
    }

    connect (): Promise<Status> {
        this.client = new Client();

        this.client.on('status', (status: ChromecastStatus) => {
            if (!this.status) {
                this.status = status;
            }

            this.status = Object.assign(this.status, status);

            const normalizedStatus = this.normalizeStatus(status);
            debug('Chromecast emitting status!', status);
            this.emit('status', normalizedStatus);
        });

        const { secretKey } = config;
        return new Promise((resolve, reject) => {
            this.client.connect(this.host, async () => {
                try {
                    debug(chalk`Connected to {cyan ${this.device.name}} {dim ${this.host}}`);

                    const launch = util.promisify<App, Player>(this.client.launch.bind(this.client));
                    this.player = await launch(DefaultMediaReceiver);
                    debug(chalk`DefaultMediaReceiver launched on {cyan ${this.device.name}} {dim ${this.host}}`);

                    debug('Getting episode list to generate full playlist...');
                    const episodes: Episode[] = await fetchJSON(episodesUrl(this.episode.seriesId));

                    // grab episodes that occurred after this one
                    const playlist = [
                        this.episode,
                        ...episodes.filter(episode => episode.hasFile && episode.seasonNumber >= this.episode.seasonNumber && episode.episodeNumber > this.episode.episodeNumber)
                    ];

                    const auth = sign({ sub: this.owner.id }, secretKey);
                    const queue: QueueItem[] = playlist.map(item => {
                        const transcodeUrl = serveTranscodedFileUrl(item.episodeFile.id, path.basename(item.episodeFile.path, path.extname(item.episodeFile.path)) + '.mp4', { auth });
                        debug(transcodeUrl);
                        return ({
                            autoplay: true,
                            preloadTime: 30,
                            startTime: 0,
                            activeTrackIds: [],
                            // playbackDuration: 5,
                            media: {
                                contentId: url.resolve(base(), transcodeUrl),
                                contentType: 'video/mp4',
                                streamType: 'BUFFERED', // or LIVE

                                metadata: {
                                    type: 0,
                                    title: item.title,
                                    releaseDate: item.airDate
                                    // todo screenshot
                                    // images: [
                                    //     { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
                                    // ]
                                }
                            }
                        });
                    });

                    debug(queue);

                    // todo LOAD VTT HERE!!!!

                    const queueLoad = util.promisify<QueueItem[], QueueOpts, ChromecastStatus>(this.player.queueLoad.bind(this.player));
                    const status: ChromecastStatus = await queueLoad(queue, {
                        startIndex: 0,
                        repeatMode: 'REPEAT_OFF'
                    });
                    this.status = status;
                    debug('queue loaded, status:', status);

                    const normalizedStatus = this.normalizeStatus(status);
                    resolve(normalizedStatus);
                } catch (ex) {
                    error(ex);
                    reject(ex);
                }
            });

            this.client.on('error', (ex) => {
                error('Chromecast client fatal error!', ex);
                error('Client will now close connection...');
                this.client.close();
                reject(ex);
            });
        });
    }

    async play () {
        this.ensurePlayer();

        const play = util.promisify<ChromecastStatus>(this.player!.play.bind(this.player));
        return this.normalizeStatus(await play());
    }

    async pause () {
        this.ensurePlayer();

        const pause = util.promisify<ChromecastStatus>(this.player!.pause.bind(this.player));
        return this.normalizeStatus(await pause());
    }

    async stop () {
        this.ensurePlayer();

        const stop = util.promisify<ChromecastStatus>(this.player!.stop.bind(this.player));
        return this.normalizeStatus(await stop());
    }

    async seek (time: number) {
        this.ensurePlayer();

        const seek = util.promisify<number, ChromecastStatus>(this.player!.seek.bind(this.player));
        return this.normalizeStatus(await seek(time));
    }

    async skip () {
        if (!(this.player && this.status && this.status.currentItemId)) {
            throw new Error('Skip not possible');
        }

        const queueUpdate = util.promisify<QueueItem[], QueueUpdateOpts, ChromecastStatus>(this.player.queueUpdate.bind(this.player));
        const updatedStatus: ChromecastStatus = await queueUpdate([], { currentItemId: this.status.currentItemId! + 1 });
        return this.normalizeStatus(updatedStatus);
    }

    async setVolume (volume: Volume) {
        if (!this.client) {
            throw new Error('Attempted to modify volume without a connection');
        }

        const setVolume = util.promisify<Volume, Volume>(this.client.setVolume.bind(this.player));
        const updatedVolume: Volume = await setVolume(volume);
        return updatedVolume;
    }

    private ensurePlayer () {
        if (!this.player) {
            throw new Error('Attempted to modify playback without a loaded player');
        }
    }

    private normalizeStatus = (status: ChromecastStatus): Status => {
        const { volume, currentTime, playerState, items, currentItemId } = status;
        let nextItem;
        if (currentItemId && items) {
            nextItem = items.find(item => item.itemId === currentItemId);
        }

        return {
            paused: playerState === 'PAUSED',
            loading: playerState === 'BUFFERING',
            currentTime,
            volume,
            skipPossible: !!nextItem
        };
    };
}