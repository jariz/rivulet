import { Receiver } from './Receiver';
import {
    App,
    Client,
    DefaultMediaReceiver,
    Player,
    QueueItem,
    QueueOpts,
    QueueUpdateOpts,
    Status
} from 'castv2-client';
import { debug, error } from '../services/log';
import { default as url, URL } from 'url';
import chalk from 'chalk';
import fetchJSON from '../services/fetchJSON';
import { episodesUrl } from '../global/apiUrls';
import { Episode } from '../../typings/media';
import util from 'util';
import Socket from '../socket';
import { Device } from '../discovery';
import { base, serveTranscodedFileUrl } from '../global/urls';
import path from 'path';
import { sign } from 'jsonwebtoken';
import { User } from '../../typings/models/user';
import main from '../main';

export class Chromecast extends Receiver {
    client: Client;
    host: string;

    constructor (device: Device, episode: Episode, socket: Socket, owner: User) {
        super(device, episode, socket, owner);

        this.client = new Client();
        const { hostname } = new URL(this.device.location);
        this.host = hostname;
    }

    play () {
        const { secretKey } = main.config;
        this.client.connect(this.host, async () => {
            try {
                debug(chalk`Connected to {cyan ${this.device.name}} {dim ${this.host}}`);

                const launch = util.promisify<App, Player>(this.client.launch.bind(this.client));
                const player: Player = await launch(DefaultMediaReceiver);
                debug(chalk`DefaultMediaReceiver launched on {cyan ${this.device.name}} {dim ${this.host}}`);

                debug('Getting episode list to generate full playlist...');
                const episodes: Episode[] = await fetchJSON(episodesUrl(this.episode.seriesId));

                // grab episodes that occurred after this one
                const playlist = [
                    this.episode,
                    ...episodes.filter(episode => episode.seasonNumber >= this.episode.seasonNumber && episode.episodeNumber > this.episode.episodeNumber)
                ];

                const auth = sign({ sub: this.owner.id }, secretKey);
                
                debug('auth', auth);
                // debug('Generated playlist:', playlist.map(episode => `S${episode.seasonNumber}E${episode.episodeNumber} - ${episode.title}`));
                const queue = playlist.map(item => {
                    const transcodeUrl = serveTranscodedFileUrl(item.episodeFile.id, path.basename(item.episodeFile.path, path.extname(item.episodeFile.path)) + '.mp4', { auth })
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

                            // Title and cover displayed while buffering
                            metadata: {
                                type: 0,
                                metadataType: 0,
                                title: item.title
                                // images: [
                                //     { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
                                // ]
                            }
                        }
                    });
                });

                debug(queue);

                // todo LOAD VTT HERE!!!!

                const queueLoad = util.promisify<QueueItem[], QueueOpts, Status>(player.queueLoad.bind(player));
                const status: Status = await queueLoad(queue, {
                    startIndex: 0,
                    repeatMode: 'REPEAT_OFF'
                });

                debug('queue loaded, status:', status);

                setTimeout(async () => {
                    try {
                        const queueUpdate = util.promisify<QueueItem[], QueueUpdateOpts, Status>(player.queueUpdate.bind(player));
                        const updatedStatus: Status = await queueUpdate([], { currentItemId: 2 });
                        debug('queueUpdate', updatedStatus);
                    } catch (ex) {
                        error(ex);
                    }
                }, 10000);
            } catch (ex) {
                error(ex);
            }
        });

        this.client.on('error', (err) => {
            error('Chromecast client fatal error!', err);
            error('Client will now close connection...');
            this.client.close();
        });
    }
}