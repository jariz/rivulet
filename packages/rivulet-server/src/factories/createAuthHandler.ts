import {ExtractJwt, Strategy} from 'passport-jwt';
import passport from 'passport';
import main from '../main';
import {User} from '../../typings/models/user';
import {debug} from '../services/log';

export default () => {
    const {db, config} = main;
    if (!db.getCollection<User>('users')) {
        db.addCollection<User>('users');
    }

    passport.use(
        new Strategy({
                jwtFromRequest: ExtractJwt.fromExtractors([
                    ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ExtractJwt.fromUrlQueryParameter('auth')
                ]),
                secretOrKey: config.secretKey
            }, ({sub, ...rest}: { sub: string }, done) => {
                let users = db.getCollection<User>('users');
                debug(`Searching for user ${sub}... Rest payload:`, rest);
                const user = users.findOne({id: sub});
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

export const handler = passport.authenticate('jwt', {session: false});