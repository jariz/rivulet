import { Episode } from '../../typings/media';
import { User } from '../../typings/models/user';
import path from 'path';

export const fakeUser: User = {
    username: 'Fakey',
    password: 'McFakefake',
    id: 'fake'
};

export const fakeEpisodes: Episode[] = [{
    'seriesId': 1,
    'episodeFileId': -1,
    'seasonNumber': 1,
    'episodeNumber': 1,
    'title': 'Eastwatch',
    'airDate': '2017-08-13',
    'airDateUtc': '2017-08-14T01:00:00Z',
    'overview': 'Daenerys demands loyalty from the surviving Lannister soldiers and Jon heeds Bran’s warning about White Walkers on the move. Cersei vows to vanquish anyone or anything that stands in her way.',
    'episodeFile': {
        'seriesId': 1,
        'seasonNumber': 1,
        'relativePath': '',
        'path': path.join(__dirname, '../../assets/BigBuckBunny_320x180_short.mp4'),
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
        'id': 1
    },
    'hasFile': true,
    'monitored': false,
    'absoluteEpisodeNumber': 1,
    'unverifiedSceneNumbering': false,
    'id': 1
}, {
    'seriesId': 1,
    'episodeFileId': -1,
    'seasonNumber': 1,
    'episodeNumber': 2,
    'title': 'Valar Morghulis"',
    'airDate': '2017-08-13',
    'airDateUtc': '2017-08-14T01:00:00Z',
    'overview': 'Tyrion awakens to a changed situation. King Joffrey doles out rewards to his subjects. As Theon stirs his men to action, Luwin offers some final advice. Brienne silences Jaime. Arya receives a gift from Jaqen. Dany goes to a strange place. Jon proves himself to Qhorin.',
    'episodeFile': {
        'seriesId': 1,
        'seasonNumber': 1,
        'relativePath': '',
        'path': path.join(__dirname, '../../assets/BigBuckBunny_320x180_short.mp4'),
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
        'id': 2
    },
    'hasFile': true,
    'monitored': false,
    'absoluteEpisodeNumber': 1,
    'unverifiedSceneNumbering': false,
    'id': 2
}, {
    'seriesId': 1,
    'episodeFileId': -1,
    'seasonNumber': 1,
    'episodeNumber': 3,
    'title': 'Valar Dohaeris',
    'airDate': '2017-08-13',
    'airDateUtc': '2017-08-14T01:00:00Z',
    'overview': 'Jon meets the King-Beyond-the-Wall while his Night Watch Brothers flee south. In King\'s Landing, Tyrion wants a reward, Margaery shows her charitable nature, Cersei arranges a dinner party, and Littlefinger offers to help Sansa. Across the Narrow Sea, Daenerys starts her journey west.',
    'episodeFile': {
        'seriesId': 1,
        'seasonNumber': 1,
        'relativePath': '',
        'path': path.join(__dirname, '../../assets/BigBuckBunny_320x180_short.mp4'),
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
        'id': 3
    },
    'hasFile': true,
    'monitored': false,
    'absoluteEpisodeNumber': 1,
    'unverifiedSceneNumbering': false,
    'id': 3
}];