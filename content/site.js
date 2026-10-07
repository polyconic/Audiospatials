/* Who Audiospatials is, in one place. The build uses this for the front page,
   the structured data search engines read, and llms.txt (the plain-text
   summary AI tools read). Never "collective". */

const SITE = {
    name: 'Audiospatials',
    url: 'https://audiospatials.com',
    description: 'Independent record label in Santa Cruz and LA, making records with artists from folk to techno. Production and mixing too. Run by Gregor Egan and Hunter Bowersmith.',
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
