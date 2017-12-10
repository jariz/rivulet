import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import main from '../main';
import { User } from '../../typings/models/user';

export default () => {
    const { db, config } = main;
    let users = db.getCollection<User>('users');

    if (!users) {
        users = db.addCollection<User>('users');
    }

    passport.use(
        new Strategy({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.secretKey
            }, ({ sub }: { sub: string }, done) => {
                const user = users.findOne({ id: sub });
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }
        )
    );
}

export const handler = passport.authenticate('jwt', { session: false });