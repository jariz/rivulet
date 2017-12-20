import { NextFunction, Request, Response, Router } from 'express';
import fetchJSON from '../services/fetchJSON';
import { episodeFileUrl, moviesUrl, radarrAvailable, seriesUrl, sonarrAvailable } from '../constants/apiUrls';
import { EpisodeFile, Movie, Show } from '../../typings/media';
import path from 'path';
import { default as querystring, stringify } from 'querystring';
import { pathExists } from 'fs-extra';
import { createReadStream } from 'fs';
import srt2vtt from 'srt-to-vtt';
import { debug } from '../services/log';
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import chalk from 'chalk';
import * as util from 'util';
import { check, validationResult } from 'express-validator/check';
import {
    Controllers,
    relative,
    serveFileUrl,
    serveSubtitleUrl,
    serveTranscodedFileUrl,
    serveUrl
} from '../constants/urls';
import { sign } from 'jsonwebtoken';
import config from '../sources/config';

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
Library.get('/player/:episodeFileId', (req: Request, res: Response, next: NextFunction) => {
    const { secretKey } = config;
    const auth = sign({ sub: req.user.id }, secretKey);
    const videoUrl = (
        !req.query.noTranscodeserve ? serveTranscodedFileUrl(req.params.episodeFileId, 'x.mp4')
            : serveFileUrl(req.params.episodeFileId, req.params.episodeFileId)
    ) + `?${querystring.stringify({ auth })}`;
    res.send(`
    <html>
    <head></head>
    <body style="margin: 0;">
        <video width="100%" autoplay height="100%" controls src="${videoUrl}">
            <track default src="${serveSubtitleUrl(req.params.episodeFileId, 'subs.vtt')}" kind="subtitles" />        
        </video>
    </body>
    </html>
    `);
});

Library.get('/serve/show/subtitle/:episodeFileId.vtt', async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { path: filePath }: EpisodeFile = await fetchJSON(episodeFileUrl(req.params.episodeFileId));

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

Library.get(relative(serveTranscodedFileUrl(':episodeFileId', ':file'), Controllers.Library), [
        check('seek').optional().isInt()
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.mapped() });
            return;
        }
        try {
            const body: EpisodeFile = await fetchJSON(episodeFileUrl(req.params.episodeFileId));

            ///////// jari dev only //////////
            body.path = '/Volumes/hdd/' + body.path.substring(9);
            //////////////////////////////////

            if (!await pathExists(body.path)) {
                res.status(404).send();
                return;
            }

            res.contentType('mp4');
            let transcoder = ffmpeg(createReadStream(body.path))
                .videoCodec('libx264')
                .audioChannels(2)
                .format('mp4')
                .outputOptions('-preset ultrafast')
                .outputOptions('-movflags frag_keyframe+empty_moov')
                .on('start', (commandLine) => {
                    debug('Started transcoding.', chalk`{dim ${commandLine}}`);
                })
                .on('error', (err: Error) => {
                    next(err);
                })
                .on('stdout', (stdOutLine: string) => {
                    debug(chalk`{bgCyan.black  ffmpeg } ${stdOutLine}`);
                });

            if (req.query.seek) {
                transcoder = transcoder.seekInput(req.query.seek);
            }

            transcoder.stream(res, { end: true });
        } catch (ex) {
            next(ex);
        }
    });

Library.get(relative(serveFileUrl(':episodeFileId', ':file'), Controllers.Library),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body: EpisodeFile = await fetchJSON(episodeFileUrl(req.params.episodeFileId));

            ///////// jari dev only //////////
            body.path = '/Volumes/hdd/' + body.path.substring(9);
            //////////////////////////////////

            res.sendFile(body.path);
        } catch (ex) {
            next(ex);
        }
    });

Library.get(relative(serveUrl(':episodeFileId'), Controllers.Library), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body: EpisodeFile = await fetchJSON(episodeFileUrl(req.params.episodeFileId));
        const query = Object.keys(req.query).length ? '?' + stringify(req.query) : '';
        ///////// jari dev only //////////
        body.path = '/Volumes/hdd/' + body.path.substring(9);
        //////////////////////////////////

        const { format: { duration } } = await probe(body.path);

        res.send({
            fileUrl: serveFileUrl(req.params.episodeFileId, path.basename(body.path)) + query,
            transcodeUrl: serveTranscodedFileUrl(req.params.episodeFileId, `${path.basename(body.path, path.extname(body.path))}.mp4`) + query,
            duration
        });
    } catch (ex) {
        next(ex);
    }
});

export default Library;