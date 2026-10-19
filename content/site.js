/* who we are, in one place. the build uses this for the front page, the
   search engine data and llms.txt (what ai tools read). never say "collective" */

const SITE = {
    name: 'Audiospatials',
    url: 'https://audiospatials.com',
    description: 'Independent record label in Santa Cruz and LA, making records with artists from folk to techno. Production and mixing too. Run by Gregor Egan and Hunter Bowersmith.',
    short: 'A catalyst of creativity. Records made with independent artists, from folk to techno.',
    email: 'hello@audiospatials.com',
    // where the studio is. la is just on gregor below, no studio there
    places: ['Santa Cruz, California'],
    founders: [
        { name: 'Gregor Egan', slug: 'gregor-egan', place: 'Los Angeles' },
        { name: 'Hunter Bowersmith', slug: 'fennec', place: 'Santa Cruz' },
    ],
    elsewhere: [
        'https://www.instagram.com/audiospatials/',
        'https://www.youtube.com/@audiospatials',
    ],
    services: ['Production', 'Recording', 'Mixing'],
    // our design studio, shows up on about and contact
    sister: { name: 'Visuospatials', url: 'https://visuospatials.com/' },
};
