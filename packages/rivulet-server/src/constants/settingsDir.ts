import os from 'os';
import path from 'path';
import fs from 'fs-extra';

const settingsDir = path.join(os.homedir(), '.config', 'rivulet');
fs.ensureDirSync(settingsDir);

export default settingsDir;