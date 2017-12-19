import fs from 'fs-extra';
import settingsDir from '../constants/settingsDir';
import path from 'path';
import { readFileSync } from 'jsonfile';
import uuid from 'uuid/v4';
import { warn } from '../services/log';
import chalk from 'chalk';
import { genSaltSync } from 'bcrypt';
import { writeFileSync } from 'fs';

const configPath = path.join(settingsDir, 'config.json');
if (!fs.pathExistsSync(configPath)) {
    writeFileSync(configPath, {});
}

const config = readFileSync(configPath, {});
if (!config.secretKey) {
    config.secretKey = uuid();
    config.salt = genSaltSync();

    warn(chalk`Autogenerated a file with randomized keys and salts for you.\r\n{dim If you wish to {bold harden your security}, please update the file configuration file at {cyan ${configPath}} yourself!}`);

    writeFileSync(configPath, config, {});
}

export default config;