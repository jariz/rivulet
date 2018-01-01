type AlternativeTitle = {
    title: string
};

type AlternativeShowTitle = AlternativeTitle & {
    seasonNumber: number
}

type AlternativeMovieTitle = AlternativeTitle & {
    sourceType: string,
    movieId: number,
    title: string,
    sourceId: number,
    votes: number,
    voteCount: number,
    language: string,
    id: number
}

type Image = {
    coverType: 'fanart' | 'banner' | 'banner';
    url: string;
}

type Season = {
    seasonNumber: string,
    monitored: boolean,
    statistics: {
        nextAiring?: string,
        previousAiring?: string,
        episodeFileCount: number,
        episodeCount: number,
        totalEpisodeCount: number,
        sizeOnDisk: number,
        percentOfEpisodes: number
    }
}

type Media = {
    title: string;
    titleSlug: string,
    sortTitle: string;
    sizeOnDisk: number;
    status: string; // todo typing (differs for show/movie)
    overview: string;
    images: Image[];
    year: number;
    path: string,
    imdbId: string,
    monitored: boolean,
    runtime: number,
    lastInfoSync: string,
    cleanTitle: string,
    genres: string[],
    tags: string[],
    added: string,
    ratings: {
        votes: number,
        value: number
    },
    profileId: number // bear in mind that a movie profileId != a show profileId
    qualityProfileId: number,
    id: number
}

export type Show = Media & {
    alternateTitles: AlternativeShowTitle[],
    seasonCount: number,
    totalEpisodeCount: number,
    episodeCount: number,
    episodeFileCount: number,
    previousAiring: string,
    network: string,
    airTime: string,
    seasons: Season[],
    profileId: number,
    seasonFolder: boolean,
    useSceneNumbering: boolean,
    tvdbId: number,
    tvRageId: number,
    tvMazeId: number,
    firstAired: string,
    seriesType: string,
    certification: string,
};

export type Movie = Media & {
    alternativeTitles: AlternativeMovieTitle[],
    secondaryYearSourceId: number,
    inCinemas: string,
    physicalRelease: string,
    website: string,
    downloaded: boolean,
    hasFile: boolean,
    youTubeTrailerId: string,
    studio: string,
    pathState: string,
    minimumAvailability: string,
    isAvailable: boolean,
    folderName: string,
    tmdbId: number
};

export type Episode = {
    seriesId: number,
    episodeFileId: number,
    episodeFile: EpisodeFile;
    seasonNumber: number,
    episodeNumber: number,
    title: string,
    airDate: string,
    airDateUtc: string,
    overview: string,
    hasFile: boolean,
    monitored: boolean,
    sceneEpisodeNumber?: number,
    sceneSeasonNumber?: number,
    tvDbEpisodeId?: number,
    absoluteEpisodeNumber: number,
    id: number,
    unverifiedSceneNumbering?: boolean
}

export type EpisodeFile = {
    seriesId: number,
    seasonNumber: number,
    path: string,
    relativePath: string,
    size: number,
    dateAdded: string,
    sceneName?: string,
    quality: {
        quality: {
            id: number,
            name: string
        },
        revision?: any;
        proper?: boolean
    },
    id: number,
    qualityCutoffNotMet?: boolean
}