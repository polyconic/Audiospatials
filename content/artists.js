/* The roster. One entry per artist, in the order they appear on /artists.

   Edit an entry, or add one, and the pages are rebuilt from this file:
   the artist's own page, the Artists grid, the sitemap and llms.txt.
   Locally: node tools/build.mjs. On GitHub it happens by itself on push.

   slug        the address: 'john-bear' lives at audiospatials.com/john-bear
   name        as it should be written
   description one or two sentences for Google and link previews
   photo       the picture on the Artists grid, in img/artists/. Also the one
               beside the bio, unless `hero` names a different one for the page
               (a photo, or a clip like 'video/luci-red.mp4')
   tagline     optional, one short line under the name
   bio         paragraphs, one string each
   photos      optional, more pictures further down the page. A name with a
               slash is a path under img/ — 'video/luci-red.mp4' plays silent
               and looping, with img/video/luci-red.webp as its still
   flip        optional, true puts the photo on the right of the bio
   credit      optional, a line under the photos (poster artist, photographer)
   listen      optional, players. kind is 'spotify', 'soundcloud' or 'youtube';
               url is the address you would share; title as it should read;
               sub optional, a small line under it. A player only loads when
               someone clicks it, so nothing tracks a visitor who doesn't.
   note        optional, a small line under the players (credits and the like)
   listenLast  optional, true puts the Spotify/YouTube players below the photos.
               SoundCloud tracks always sit under the bio.
*/

const ARTISTS = [
    {
        slug: 'luci',
        description: 'Berlin DJ, originally from California and formed in the Lyon underground. Dark, hypnotic sets drawn from post-rock and goth.',
        name: 'LUCI',
        photo: 'luci.webp',
        hero: 'video/luci-red.mp4',
        bio: [
            'LUCI is a Berlin-based DJ, first emerging from the underground Lyon scene and originally from California. She draws inspiration from post-rock and gothic rock. Her captivating, dark, and hypnotic sets have taken her across France, with performances in cities like Paris, Lyon, and Montpellier and in 2026, Berlin.',
            'Her successful shows have led her to share the stage with renowned artists such as David Löhlein, Cassie Raptor, Nikolina, LOLALITA, FUTUR IS OFFLINE, and MA ČKA.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://soundcloud.com/luci-picarelli/luci-sucre-lyon-06-10-25', title: 'luci @ Le Sucre (Lyon, 10-06-25)' },
        ],
        photos: ['luci-stage.webp', 'video/luci-crowd.mp4', 'luci.webp'],
    },
    {
        slug: 'krow',
        description: 'Minimal house and deep tech DJ with Chicago and San Francisco roots. Played Lollapalooza 2023.',
        name: 'kröw',
        photo: 'krow.webp',
        bio: [
            'kröw intricately weaves her Chicago roots and San Francisco upbringing into her music. She has curated a unique blend of Minimal House/Deep Tech with her distinctive touch you can only ever understand live.',
            'A true milestone in her career was her music festival debut at Lollapalooza 2023. Her emphasis on delivering hypnotic beats, along with a fifth sense for what the crowd desires, keeps the dance floor packed all night long. Her dedication to pushing the boundaries of music makes her an unmissable talent.',
        ],
        listen: [
            { kind: 'youtube', url: 'https://www.youtube.com/watch?v=qLlb-5TRAX8', title: 'kröw, live' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/stephkrow/steph-lolla-2023', title: 'LIVE @ Lollapalooza 2023 Budlight Backyard Stage' },
        ],
        photos: ['krow-live-6.webp', 'krow-live-5.webp', 'krow-press-4.webp', 'krow-show-9.webp'],
    },
    {
        slug: 'fennec',
        description: 'A Santa Cruz band blending rock, folk and electronic sound, led by Hunter Bowersmith.',
        name: 'FENNEC',
        photo: 'fennec.webp',
        tagline: 'A Santa Cruz-based band.',
        bio: [],
        photos: ['fennec-poster-1.webp', 'fennec-poster-2.webp', 'fennec-poster-3.webp'],
        credit: 'Poster art by Ross Mantell',
    },
    {
        slug: 'gregor-egan',
        description: 'LA producer and DJ. Hypnotic, textural techno shaped by jazz training and Chicago house.',
        name: 'Gregor Egan',
        photo: 'gregor-egan.webp',
        hero: 'gregor-egan-grain.webp',
        tagline: 'Techno producer and DJ.',
        bio: [
            'Gregor Egan is a Los Angeles-based producer and DJ whose techno draws from jazz training, Chicago house floors, and a sustained obsession with the hypnotic and textural.',
            'He began producing in 2020, drawing from trip-hop, electronica, and IDM before narrowing his focus. Atmospheric and dark sound design, built now around Elektron hardware and a Moog Grandmother.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://soundcloud.com/gregoregan/spontaneous-friday-mix', title: 'Spontaneous Friday Mix' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/gregoregan/for-hor', title: 'for HOR' },
        ],
        photos: ['gregor-egan-stage.webp', 'gregor-egan.webp'],
    },
    {
        slug: 'john-bear',
        description: 'Santa Cruz folk songwriter, originally from Birmingham, Alabama. Blueberry Pie EP out on Audiospatials.',
        name: 'John Bear',
        photo: 'john-bear.webp',
        tagline: 'John Bear is a folk artist in Santa Cruz.',
        bio: [
            "You know that feeling when you find a new song you love? The song that understands you and speaks to you like a good listener? The music that feels like it's keeping you alive and afloat in a life who's waters are far deeper than your toes can reach? I desire with the wildest reaches of my heart that my songs can be that for people.",
            "Writing songs is something I can't help but do. Like trees can't help but grow out of our soil. Sharing the songs is my effort to make the world a kinder place than I found it.",
            "John Denver and the Nitty Gritty Dirt Band helped me find my love for music at a young age. I am from Birmingham Alabama but never found home until I found California. And from here I want to be the songs that people can lean on.",
            "— John Bear",
        ],
        listen: [
            { kind: 'spotify', url: 'https://open.spotify.com/album/1BOYiMGrk8CGzkVfN4N7aj', title: 'Blueberry Pie EP', sub: 'EP' },
            { kind: 'spotify', url: 'https://open.spotify.com/artist/1AdQ7OOSbL8yQlqB9KkNVS', title: 'John Bear', sub: 'Top tracks' },
        ],
        note: 'Blueberry Pie + Rachel Made Coffee produced and mixed by Hunter Bowersmith. Mastered by Gregor Egan on Blueberry Pie EP by John Bear.',
        photos: ['john-bear-3.webp', 'john-bear-4.webp'],
    },
    {
        slug: 'margo-flow',
        description: 'New York City singer-songwriter. Folk and pop about the inner world and the natural one.',
        name: 'Margo Flow',
        photo: 'margo-flow.webp',
        bio: [
            'Margo Flow is a singer-songwriter based in New York City. Her songs are a patchwork expression of the emotional ebb and flow of her internal landscape along with a calling for hope and appreciation of the natural world and sustainability. Her sound is inspired by 60s folk artists, like Bob Dylan and Joni Mitchell, and modern confessional artists, like Taylor Swift and Lizzy McAlpine. She tries to emulate the song of the natural world in her music through her lyrics and sonic world. Pop, folk, and acoustic genres inspire her sound. She hopes that her songs can serve as a gateway for inspiring others to take steps towards enlivening their own personal dreams and their dreams for the world at large.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://soundcloud.com/margo-anna/children', title: 'children' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/margo-anna/nyc', title: 'nyc' },
        ],
    },
    {
        slug: 'stazrad',
        description: 'A folk song that turns hardcore. Emo, prog and finger-picked acoustic songs from a Bay Area artist born in St. Louis.',
        name: 'Stäzrad',
        photo: 'stazrad.webp',
        flip: true,
        bio: [
            'If Stäzrad’s style could be distilled to a single word it would be: authentic, raw, and emo (a single word wouldn’t suffice). Emo as in emotionally vulnerable lyrical content conveyed through gut-wrenching vocal releases over musical climaxes that are sure to transport you into an existential catharsis…but of course, the tendrils of midwest emo (in the traditional sense) and hardcore have slithered their way all throughout the folk-acoustic and poly-rhythmic musings of this unique artist.',
            'Drawing inspiration from the psychedelic 60s from the likes of Pink Floyd and The Beatles (after they discovered acid ofc) all the way to modern prog-rock stylings from the iconic Radiohead soundscape and post-hardcore breakdowns of Circa Survive, we find ourselves with a one: Stäzrad. Have you ever heard a folk song turn hardcore? As if Fleetwood Mac were cowriting a tune with Bob Dylan when suddenly the whole squad was transported to the middle of an Underoath mosh pit? If that’s hard to fathom give Stäzrad’s finger-pickin’, heart-rippin’ original “Autumn-Like Changes” a listen :)',
            'An inter-dimensional pontificator adventuring through time and space, manifested into a physical form in our shared dimension and instilled with the conviction to share perspective through audio artform is where we find our artist. Born and raised in St. Louis, Stäzrad busted out of the midwest and hit the road full time to pursue a life of nomadic adventure chasing rock climbs and rock shows across the North American West. The siren song of the West Coast has finally lured Stäz into a California dreamin’ era that now establishes East Bay as home-base.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://soundcloud.com/stazrad/gist-ode-to-mac-miller', title: 'gist (ode to mac miller)' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/stazrad/they-themestry', title: 'they/themestry' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/stazrad/salad-for-life-tk0-mp3', title: 'salad for life tk0.mp3' },
            { kind: 'soundcloud', url: 'https://soundcloud.com/stazrad/sets/originals', title: 'Originals', sub: 'Playlist' },
        ],
    },
    {
        slug: 'wolfmanwoof',
        description: 'Two producers, one from techno and one from experimental synth-rock, meeting in between. Moonrise EP out now.',
        name: 'WOLFMANWOOF',
        photo: 'wolfmanwoof.webp',
        bio: [
            'WOLFMANWOOF is a collaborative project between two producers working in opposite corners of music. Techno and experimental synth-rock. The music lives somewhere in between.',
        ],
        releases: 'WOLFMANWOOF',
    },
    /* On the old site's grid but without pages yet. Uncomment an entry once it
       has a photo, description and bio, and its page is built with the rest.
    { slug: 'canary', name: 'Canary', photo: '' },
    { slug: 'the-silver-spurs', name: 'The Silver Spurs', photo: '' },
    { slug: 'hunter-ray', name: 'Hunter Ray', photo: '' },
    { slug: 'pablo-cervantes', name: 'Pablo Cervantes', photo: '' },
    */
];
