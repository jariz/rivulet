import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { User } from '../../typings/models/user';
import { debug, warn } from '../services/log';
import db from '../sources/db';
import config from '../sources/config';
import { NextFunction, Request, Response } from 'express';
import { isTesting } from '../constants/env';

export default () => {
    if (isTesting) {
        warn('Auth handler: disabling authorization because we\'re in testing mode.');
        return;
    }

    passport.use(
        new Strategy({
                jwtFromRequest: ExtractJwt.fromExtractors([
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ExtractJwt.fromUrlQueryParameter('auth')
                ]),
                secretOrKey: config.secretKey
            }, ({ sub, ...rest }: { sub: string }, done) => {
                let users = db.getCollection<User>('users');
                debug(`Searching for user ${sub}... Rest payload:`, rest);
                const user = users.findOne({ id: sub });
                debug('Verify callback result', user);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        )
    );
}

export const handler = (
    !isTesting ? passport.authenticate('jwt', { session: false })
        : (req: Request, res: Response, next: NextFunction) => next()
);