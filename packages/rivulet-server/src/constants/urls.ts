import ip from 'ip';
// import main from '../main';
import querystring from 'querystring';

type ControllerPath = '/library' | '/auth' | '/devices'

export const Controllers: { [name: string]: ControllerPath } = {
    Library: '/library',
    Auth: '/auth',
    Devices: '/devices'
};

const removeEmptyParams = (params?: { [key: string]: any }) => {
    if (!params) {
        return '';
    }
    return Object.keys(params)
        .filter((key: string) => typeof params[key] !== 'undefined')
        .map(key => ({ [key]: params[key] }))
        .reduce((a, b) => Object.assign(a, b), {});
};
const generateQueryParams = (params?: { [key: string]: any }) => params ? ('?' + querystring.stringify(removeEmptyParams(params))) : '';

// utilities
export const relative = (absoluteUrl: string, controller: ControllerPath) => absoluteUrl.substring(controller.length);
export const base = () => process.env.BASE_URL || `http://${ip.address('public')}:3000/`;

// urls
export const playerUrl = (episodeFileId: number | string) => `/library/player/${episodeFileId}`;
export const serveUrl = (episodeFileId: number | string) => `/library/show/serve/${episodeFileId}`;
export const serveTranscodedFileUrl = (episodeFileId: number | string, fileName: string, query?: { seek?: number, auth?: string }) => `/library/show/serve/${episodeFileId}/transcoded/${fileName}` + generateQueryParams(query);
export const serveFileUrl = (episodeFileId: number | string, fileName: string, query?: { auth?: string }) => `/library/show/serve/${episodeFileId}/${fileName}` + generateQueryParams(query);
export const serveSubtitleUrl = (episodeFileId: number | string, fileName: string, query?: { auth?: string }) => `/library/show/serve/subtitle/${episodeFileId}/${fileName}` + generateQueryParams(query);
export const devicesUrl = () => `/devices/`;
export const loginUrl = () => `/auth/login`;
export const registerUrl = () => `/auth/register`;
