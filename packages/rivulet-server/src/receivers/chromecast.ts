import { Receiver } from './Receiver';
import { DefaultMediaReceiver, Client, Player } from 'castv2-client';
import { error } from '../services/log';

export class Chromecast extends Receiver {
    client: Client;
    play () {
        this.client = new Client();
        this.client.connect(this.device.location, () => {
            this.client.launch(DefaultMediaReceiver, (err: Error, player: Player) => {
                const media = {
                    // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
                    contentId: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/big_buck_bunny_1080p.mp4',
                    contentType: 'video/mp4',
                    streamType: 'BUFFERED', // or LIVE

                    // Title and cover displayed while buffering
                    metadata: {
                        type: 0,
                        metadataType: 0,
                        title: 'Big Buck Bunny',
                        images: [
                            { url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg' }
                        ]
                    }
                };
                
                // todo LOAD VTT HERE!!!!

                // todo promisify fucking everything
                player.load(media, { autoplay: true}, (err: Error, status: any) => {
                    
                });
            })
        })

        this.client.on('error', (err) => {
            error('Chromecast client fatal error!', err);
            error('Client will now close connection...');
            this.client.close();
        });
    }
}