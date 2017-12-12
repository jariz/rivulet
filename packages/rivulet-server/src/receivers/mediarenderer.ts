import {Receiver} from "./Receiver";
import MediaRendererClient from 'upnp-mediarenderer-client';
import {Device} from "../discovery";
import Socket from "../socket";
import {Episode} from "../../typings/media";
import {error} from "../services/log";

// TODO promisify methods.
export class Mediarenderer extends Receiver {
    client: any;

    constructor(device: Device, episode: Episode, socket: Socket) {
        super(device, episode, socket);
        this.connect();
    }

    onLoad() {
        console.log('client is loading!');
    }

    onPlay() {
        console.log('client is playing!');
    }

    onPause() {
        console.log('client is paused!');
    }

    onSpeedChange(speed: any) {
        console.log('client speed changed!', speed);
    }

    onStatus(status: any) {
        console.log('status!', status);
    }

    pause() {
        this.client.pause();
    }

    stop() {
        this.client.stop();
    }

    // seek time in seconds
    seek(time: number) {
        this.client.seek(time);
    }

    play() {
        this.client.play();
    }

    get mediaDuration() {
        return this.client.getDuration((err: any, duration: any) => {
            if (err) {
                return error(err);
            }
            return duration;
        });
    }

    get position() {
        return this.client.getPosition((err: any, position: any) => {
            if (err) {
                return error(err);
            }
            return position;
        });
    }


    get options() {
        return {
            autoplay: true,
            contentType: 'video/mp4',
            metadata: {
                title: 'A better movie title',
                creator: 'Thomas',
                type: 'video',
                // subtitles dont work atm, see
                // https://gist.github.com/thibauts/5f5f8d8ce6566c8289e6
                // for the headers the srt server should send
                // and https://www.npmjs.com/package/upnp-mediarenderer-client
                // for more info

                // subtitlesUrl: 'https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt'
            }
        }
    }


    send() {
        // 1080p crashes?!
        // 1080p uri: http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4
        //
        this.client.load('http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4', this.options, (err: any, result: any) => {
            if (err) {
                return error(err);
            }

            this.client.on('loading', this.onLoad);
            this.client.on('playing', this.onPlay);
            this.client.on('stopped', this.onPlay);
            this.client.on('paused', this.onPause);
            this.client.on('status', this.onStatus);
            this.client.on('speedChanged', this.onSpeedChange);
        })
    }

    connect() {
        this.client = new MediaRendererClient(this.device.location);
        this.send();
    };

}