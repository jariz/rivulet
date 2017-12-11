import fetch, { RequestInit } from 'node-fetch';

export default async (url: string, options?: RequestInit) => {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
}