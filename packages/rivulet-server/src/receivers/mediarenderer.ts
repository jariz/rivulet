import {Receiver} from "./Receiver";
import MediaRendererClient from 'upnp-mediarenderer-client';
import {Device} from "../discovery";
import Socket from "../socket";
import {Episode} from "../../typings/media";
import {error} from "../services/log";

// TODO promisify methods where possible.
export class Mediarenderer extends Receiver {
    client: any;

    constructor(device: Device, episode: Episode, socket: Socket) {
        super(device, episode, socket);
        this.connect();
    }

    onLoad() {
        // i.e send request via websocket to notify frontend that is loading, etc etc
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
                // subtitlesUrl: ''
            }
        }
    }


    send() {
        // sample video list: http://www.demo-world.eu/2d-demo-trailers-hd/
        // 720p uri: http://sample-videos.com/video/mp4/720/big_buck_bunny_720p_10mb.mp4
        // 1080p uri: http://s1.demo-world.eu/hd_trailers.php?file=sony_paris-DWEU.mkv
        this.client.load('http://s1.demo-world.eu/hd_trailers.php?file=sony_paris-DWEU.mkv', this.options, (err: any, result: any) => {
            if (err) {
                switch (err.errorCode) {
                    case 716:
                        return error('Media not found. ');

                    default:
                        return error(err);
                }
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

        //
        this.send();
    };

}