import chalk from 'chalk';

type LogType = 'log' | 'error' | 'warn' | 'debug'

const log = (type: LogType = 'log', message: any, ...misc: any[]) => {
    if (type === 'debug' && process.env.DEBUG !== 'true') {
        return;
    }
    if (process.env.NODE_ENV === 'test' && type !== 'error') {
        // we do not care for pretty much any logging whilst testing
        return;
    }
    
    let content = [];
    switch (type) {
        case 'log':
            content = [chalk`{bold.cyan INFO}`];
            break;
        case 'error':
            content = [chalk`{bold.red ERR!}`];
            break;
        case 'warn':
            content = [chalk`{bold.yellow WARN}`];
            break;
        case 'debug': {
            content = [chalk`{bold.magenta VERB}`];
            break;
        }
        default:
            throw new Error(`Invalid log type: ${type}`);
    }

    content = [...content, message, ...misc];

    console[type === 'debug' ? 'log' : type](...content);
};

export const info = (message: any, ...rest: any[]) => log('log', message, ...rest);
export const error = (message: any, ...rest: any[]) => log('error', message, ...rest);
export const warn = (message: any, ...rest: any[]) => log('warn', message, ...rest);
export const debug = (message: any, ...rest: any[]) => log('debug', message, ...rest);