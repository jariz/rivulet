import Server from './server';
import { EpisodeFile } from '../typings/media';
import { RequestInit } from 'node-fetch';

export const server = new Server();
server.start();

jest.mock('./services/fetchJSON', () => {
    require('dotenv').config();

    /* tslint:disable */
    const { fakeEpisodes } = require('./constants/mock');
    const { episodeFileUrl } = require('./constants/apiUrls');
    const { debug } = require('./services/log');
    const { URL } = require('url');
    /* tslint:enable */

    // generate fake API 🤤
    const sitemap = new Map<string, EpisodeFile>();
    for (const episode of fakeEpisodes) {
        const { pathname } = new URL(episodeFileUrl(episode.episodeFile.id));
        sitemap.set(pathname, episode.episodeFile);
    }
    
    return (url: string, options?: RequestInit): EpisodeFile => {
        const { pathname } = new URL(url);

        debug(pathname, sitemap);
        if (sitemap.has(pathname)) {
            return sitemap.get(pathname)!;
        } else {
            throw new Error('404 Not Found');
        }
    };
});
