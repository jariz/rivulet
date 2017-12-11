import { NextFunction, Request, Response, Router } from 'express';
import fetchJSON from '../services/fetchJSON';
import { episodeFileUrl, moviesUrl, radarrAvailable, seriesUrl, sonarrAvailable } from '../global/apiUrls';
import { Movie, Show } from '../../typings/media';
import path from 'path';
import { stringify } from 'querystring';
import { pathExists } from 'fs-extra';
import { createReadStream } from 'fs';
import srt2vtt from 'srt-to-vtt';
import { debug, error } from '../services/log';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import chalk from 'chalk';
import * as util from 'util';
import { check, validationResult } from 'express-validator/check';

const Library = Router();
const probe = util.promisify<string, FfprobeData>(ffmpeg.ffprobe);

Library.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let series: Show[] | null = null;
        let movies: Movie[] | null = null;
        if (sonarrAvailable()) {
            series = await fetchJSON(seriesUrl());
        }
        if (radarrAvailable()) {
            movies = await fetchJSON(moviesUrl());
        }

        res.send({ series, movies });
    } catch (ex) {
        next(ex);
    }
});

// will be removed once FE is in place
Library.get('/player/:episodeId', (req: Request, res: Response, next: NextFunction) => {
    res.send(`
    <html>
    <head></head>
    <body style="margin: 0;">
        <video width="100%" autoplay height="100%" controls src="http://${req.hostname}:3000/library/serve/show/${req.params.episodeId}${!req.query.noTranscode ? '/transcode/x.mp4' : ''}?auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTIyZjI4Yy1iYWNkLTRkMWUtYWYyMy04ZDBmOTg0NWJmYmUiLCJpYXQiOjE1MTI5NDU2MjR9.3bSSHy-EqFcAngTWghu-Dtei_yf2iw3VYVtbc4N7ijE">
            <track default src="http://${req.hostname}:3000/library/serve/show/subtitle/${req.params.episodeId}.vtt?auth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3MTIyZjI4Yy1iYWNkLTRkMWUtYWYyMy04ZDBmOTg0NWJmYmUiLCJpYXQiOjE1MTI5NDU2MjR9.3bSSHy-EqFcAngTWghu-Dtei_yf2iw3VYVtbc4N7ijE" kind="subtitles" />        
        </video>
    </body>
    </html>
    `);
});

Library.get('/serve/show/subtitle/:episodeId.vtt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { path: filePath } = await fetchJSON(episodeFileUrl(req.params.episodeId));

        ///////// jari dev only //////////
        filePath = '/Volumes/hdd/' + filePath.substring(9);
        //////////////////////////////////

        const srtPath = path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + '.srt');
        debug('Looking for', srtPath);
        if (await pathExists(srtPath)) {
            res.contentType('text/vtt');
            createReadStream(srtPath)
                .pipe(srt2vtt())
                .pipe(res);
        } else {
            res.status(404).send();
        }
    } catch (ex) {
        next(ex);
    }
});

Library.get('/serve/show/:episodeId/transcode/:file', [
        check('seek').isInt()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.mapped() });
            return;
        }
        try {
            const body = await fetchJSON(episodeFileUrl(req.params.episodeId));

            ///////// jari dev only //////////
            body.path = '/Volumes/hdd/' + body.path.substring(9);
            //////////////////////////////////

            if (!await pathExists(body.path)) {
                res.status(404).send();
                return;
            }

            res.contentType('webm');
            let transcoder = ffmpeg(createReadStream(body.path))
                .videoCodec('libx264')
                .format('mp4')
                .outputOptions('-movflags frag_keyframe+empty_moov')
                .on('start', (commandLine) => {
                    debug('Started transcoding.', chalk`{dim ${commandLine}}`);
                })
                .on('error', (err: Error) => {
                    next(err);
                })
                .on('stderr', (stdErrLine: string) => {
                    error(chalk`{bgCyan.black  ffmpeg } ${stdErrLine}`);
                });

            if (req.query.seek) {
                transcoder = transcoder.seekInput(req.query.seek);
            }

            transcoder.stream(res, { end: true });
        } catch (ex) {
            next(ex);
        }
    });

Library.get('/serve/show/:episodeId/:file', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = await fetchJSON(episodeFileUrl(req.params.episodeId));

        ///////// jari dev only //////////
        body.path = '/Volumes/hdd/' + body.path.substring(9);
        //////////////////////////////////

        res.sendFile(body.path);
    } catch (ex) {
        next(ex);
    }
});

Library.get('/serve/show/:episodeId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = await fetchJSON(episodeFileUrl(req.params.episodeId));
        const query = Object.keys(req.query).length ? '?' + stringify(req.query) : '';
        ///////// jari dev only //////////
        body.path = '/Volumes/hdd/' + body.path.substring(9);
        //////////////////////////////////

        const { format: { duration } } = await probe(body.path);

        res.send({
            fileUrl: `/library/serve/show/${req.params.episodeId}/${path.basename(body.path)}${query}`,
            transcodeUrl: `/library/serve/show/${req.params.episodeId}/transcode/${path.basename(body.path, path.extname(body.path))}.mp4${query}`,
            duration
        });
    } catch (ex) {
        next(ex);
    }
});

export default Library;