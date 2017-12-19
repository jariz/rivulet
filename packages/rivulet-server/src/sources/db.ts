import loki from 'lokijs';
import settingsDir from '../constants/settingsDir';
import path from 'path';

const db: loki = new loki(path.join(settingsDir, 'db.json'), {
    autosave: true,
    autoload: true
});

export default db;