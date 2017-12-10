import loki from 'lokijs';
import settingsDir from '../global/settingsDir';
import path from 'path';

export default (): loki => new loki(path.join(settingsDir, 'db.json'))