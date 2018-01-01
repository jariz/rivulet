import loki from 'lokijs';
import settingsDir from '../constants/settingsDir';
import path from 'path';
import { User } from '../../typings/models/user';

const db: loki = new loki(path.join(settingsDir, 'db.json'), {
    autosave: true,
    autoload: true
});

// ''''migrations''''
if (!db.getCollection<User>('users')) {
    db.addCollection<User>('users');
}

export default db;