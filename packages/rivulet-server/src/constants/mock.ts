import { Episode } from '../../typings/media';

export const fakeEpisode: Episode = {
    'seriesId': 1,
    'episodeFileId': 5,
    'seasonNumber': 7,
    'episodeNumber': 5,
    'title': 'Eastwatch',
    'airDate': '2017-08-13',
    'airDateUtc': '2017-08-14T01:00:00Z',
    'overview': 'Daenerys demands loyalty from the surviving Lannister soldiers and Jon heeds Bran’s warning about White Walkers on the move. Cersei vows to vanquish anyone or anything that stands in her way.',
    'episodeFile': {
        'seriesId': 1,
        'seasonNumber': 7,
        'relativePath': 'Season 7/Game.of.Thrones.S07E05.720p.BluRay.x264-DEMAND.mkv',
        'path': '/Volumes/hdd/Downloads/Game of Thrones/Season 7/Game.of.Thrones.S07E05.720p.BluRay.x264-DEMAND.mkv',
        'size': 2340860671,
        'dateAdded': '2017-12-03T16:16:57.034322Z',
        'quality': {
            'quality': {
                'id': 6,
                'name': 'Bluray-720p'
            },
            'revision': {
                'version': 1,
                'real': 0
            }
        },
        'qualityCutoffNotMet': false,
        'id': 5
    },
    'hasFile': true,
    'monitored': false,
    'absoluteEpisodeNumber': 65,
    'unverifiedSceneNumbering': false,
    'id': 105
};
// export const fakeEpsiode: Episode = {
//     'seriesId': 2,
//     'episodeFileId': 72,
//     'seasonNumber': 2,
//     'episodeNumber': 12,
//     'title': 'eps2.9_pyth0n-pt2.p7z',
//     'airDate': '2016-09-21',
//     'airDateUtc': '2016-09-22T02:00:00Z',
//     'overview': 'Darlene realizes she is in too deep; an old friend reveals everything to Elliot',
//     'episodeFile': {
//         'seriesId': 2,
//         'seasonNumber': 2,
//         'relativePath': 'Season 2/Mr.Robot.S02E12.ep2.9.pyth0n-pt2.p7z.720p.WEB-DL.DD5.1.H264-NTb[rarbg].mkv',
//         'path': '/mnt/HDD/Downloads/Mr. Robot/Season 2/Mr.Robot.S02E12.ep2.9.pyth0n-pt2.p7z.720p.WEB-DL.DD5.1.H264-NTb[rarbg].mkv',
//         'size': 1601871338,
//         'dateAdded': '2017-12-04T02:01:51.67403Z',
//         'sceneName': 'Mr.Robot.S02E12.ep2.9.pyth0n-pt2.p7z.720p.WEB-DL.DD5.1.H264-NTb[rarbg]',
//         'quality': {
//             'quality': {
//                 'id': 5,
//                 'name': 'WEBDL-720p'
//             },
//             'revision': {
//                 'version': 1,
//                 'real': 0
//             }
//         },
//         'qualityCutoffNotMet': true,
//         'id': 72
//     },
//     'hasFile': true,
//     'monitored': false,
//     'absoluteEpisodeNumber': 22,
//     'unverifiedSceneNumbering': false,
//     'id': 133
// }