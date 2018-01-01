import fetch, { RequestInit } from 'node-fetch';
import { debug } from './log';

const fetchJSON = async (url: string, options?: RequestInit) => {
    debug(url, options ? options : '');
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
}

export default fetchJSON;