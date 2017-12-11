import validVar from './validVar';

type serviceType = 'RADARR' | 'SONARR';

const testVars = (type: serviceType) => validVar(`${type}_API_URL`) && validVar(`${type}_API_KEY`);
const url = (path: string, type: serviceType) => `${process.env[type + '_API_URL']}${path}?apikey=${process.env[type + '_API_KEY']}`;

export const radarrAvailable = () => testVars('RADARR');
export const sonarrAvailable = () => testVars('SONARR');

export const seriesUrl = () => url('series', 'SONARR');
export const episodeFileUrl = (id: string) => url(`episodefile/${id}`, 'SONARR');
export const moviesUrl = () => url('movie', 'RADARR');