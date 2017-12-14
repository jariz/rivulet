import { NextFunction, Request, Response, Router } from 'express';
import main from '../main';
import { User } from '../../typings/models/user';
import { check, validationResult } from 'express-validator/check';
import { hash, compare } from 'bcrypt';
import uuid from 'uuid/v4';
import { sign } from 'jsonwebtoken';
import { Controllers, loginUrl, registerUrl, relative } from '../global/urls';

const Auth: Router = Router();

const validations = [
    check('username').exists().isAlphanumeric(), // todo existence in db
    check('password').exists().isLength({ min: 8 })
];

// todo will probably be removed entirely and replaced with invitation email a là streama
Auth.get(relative(registerUrl(), Controllers.Auth), validations, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        const { db, config: { salt, secretKey } } = main;

        const users = db.getCollection<User>('users');
        const { username, password } = req.body;
        const id = uuid();
        users.insert({
            id,
            username,
            password: await hash(password, salt)
        });

        return res.json({
            token: sign({ sub: id }, secretKey)
        });
    } catch (ex) {
        return next(ex);
    }
});

Auth.get(relative(loginUrl(), Controllers.Auth), validations, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    try {
        const { db, config: { secretKey } } = main;

        const users = db.getCollection<User>('users');
        const { username, password } = req.body;
        const user = users.findOne({
            username
        });
        
        if (!user) {
            throw new Error('User does not exist.')
        }
        
        if (!await compare(password, user.password)) {
            throw new Error('Incorrect password');
        }

        return res.json({
            token: sign({ sub: user.id }, secretKey)
        });
    } catch (ex) {
        return next(ex);
    }
});

export default Auth;