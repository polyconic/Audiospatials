/* Who Audiospatials is, in one place. The build uses this for the front page,
   the structured data search engines read, and llms.txt (the plain-text
   summary AI tools read). Never "collective". */

const SITE = {
    name: 'Audiospatials',
    url: 'https://audiospatials.com',
    description: 'Audiospatials is a catalyst of creativity. We make records with independent artists, from folk to techno. A studio in Santa Cruz and Los Angeles, run by Gregor Egan and Hunter Bowersmith.',
    short: 'A catalyst of creativity. Records made with independent artists, from folk to techno.',
    email: 'hello@audiospatials.com',
    places: ['Santa Cruz, California', 'Los Angeles, California'],
    founders: [
        { name: 'Gregor Egan', slug: 'gregor-egan', place: 'Los Angeles' },
        { name: 'Hunter Bowersmith', slug: 'fennec', place: 'Santa Cruz' },
    ],
    elsewhere: [
        'https://www.instagram.com/audiospatials/',
        'https://www.youtube.com/@audiospatials',
    ],
    services: ['Production', 'Recording', 'Mixing'],
    // Gregor and Hunter's design studio; named on About and Contact.
    sister: { name: 'Visuospatials', url: 'https://visuospatials.com/' },
};
