/* The roster. One entry per artist, in the order they appear on /artists.

   To change an artist's text or photos, edit their entry here — nothing else.
   To add an artist, add an entry here AND copy one of the artist pages
   (john-bear.html, say) to a new file named after the slug, changing the
   slug, title and description at the top of it.

   slug      the address: 'john-bear' lives at audiospatials.com/john-bear
   name      as it should be written
   photo     the picture on the Artists grid, in img/artists/
   tagline   optional, one short line under the name
   bio       paragraphs, one string each
   photos    optional, more pictures further down the page
   credit    optional, a line under the photos (poster artist, photographer)
   listen    optional, players. kind is 'spotify', 'soundcloud' or 'youtube';
             url is the address you would share. A player only loads when
             someone clicks it, so nothing tracks a visitor who doesn't.
   note      optional, a small line under the players (credits and the like)
*/

const ARTISTS = [
    {
        slug: 'fennec',
        name: 'FENNEC',
        photo: 'fennec.webp',
        tagline: 'A Santa Cruz-based band.',
        bio: [],
        photos: ['fennec-poster-1.webp', 'fennec-poster-2.webp', 'fennec-poster-3.webp'],
        credit: 'Poster art by Ross Mantell',
    },
    {
        slug: 'john-bear',
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
            { kind: 'spotify', url: 'https://open.spotify.com/album/1BOYiMGrk8CGzkVfN4N7aj', title: 'Blueberry Pie EP' },
            { kind: 'spotify', url: 'https://open.spotify.com/artist/1AdQ7OOSbL8yQlqB9KkNVS', title: 'John Bear on Spotify' },
        ],
        note: 'Blueberry Pie + Rachel Made Coffee produced and mixed by Hunter Bowersmith. Mastered by Gregor Egan on Blueberry Pie EP by John Bear.',
        photos: ['john-bear-3.webp', 'john-bear-4.webp'],
    },
    {
        slug: 'luci',
        name: 'LUCI',
        photo: 'luci.webp',
        bio: [
            'LUCI is a Berlin-based DJ, first emerging from the underground Lyon scene and originally from California. She draws inspiration from post-rock and gothic rock. Her captivating, dark, and hypnotic sets have taken her across France, with performances in cities like Paris, Lyon, and Montpellier and in 2026, Berlin.',
            'Her successful shows have led her to share the stage with renowned artists such as David Löhlein, Cassie Raptor, Nikolina, LOLALITA, FUTUR IS OFFLINE, and MA ČKA.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://api.soundcloud.com/tracks/2149285848', title: 'LUCI on SoundCloud' },
        ],
    },
    {
        slug: 'gregor-egan',
        name: 'Gregor Egan',
        photo: 'gregor-egan.webp',
        tagline: 'Techno producer and DJ.',
        bio: [
            'Gregor Egan is a Los Angeles-based producer and DJ whose techno draws from jazz training, Chicago house floors, and a sustained obsession with the hypnotic and textural.',
            'He began producing in 2020, drawing from trip-hop, electronica, and IDM before narrowing his focus. Atmospheric and dark sound design, built now around Elektron hardware and a Moog Grandmother.',
        ],
        photos: ['gregor-egan-red.webp', 'gregor-egan-live.webp'],
    },
    {
        slug: 'margo-flow',
        name: 'Margo Flow',
        photo: 'margo-flow.webp',
        bio: [
            'Margo Flow is a singer-songwriter based in Santa Cruz, CA. Her songs are a patchwork expression of the emotional ebb and flow of her internal landscape along with a calling for hope and appreciation of the natural world and sustainability. Her sound is inspired by 60s folk artists, like Bob Dylan and Joni Mitchell, and modern confessional artists, like Taylor Swift and Lizzy McAlpine. She tries to emulate the song of the natural world in her music through her lyrics and sonic world. Pop, folk, and acoustic genres inspire her sound. She hopes that her songs can serve as a gateway for inspiring others to take steps towards enlivening their own personal dreams and their dreams for the world at large.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://api.soundcloud.com/tracks/2042923028', title: 'Margo Flow on SoundCloud' },
        ],
    },
    {
        slug: 'krow',
        name: 'kröw',
        photo: 'krow.webp',
        bio: [
            'kröw intricately weaves her Chicago roots and San Francisco upbringing into her music. She has curated a unique blend of Minimal House/Deep Tech with her distinctive touch you can only ever understand live.',
            'A true milestone in her career was her music festival debut at Lollapalooza 2023. Her emphasis on delivering hypnotic beats, along with a fifth sense for what the crowd desires, keeps the dance floor packed all night long. Her dedication to pushing the boundaries of music makes her an unmissable talent.',
        ],
        listen: [
            { kind: 'youtube', url: 'https://www.youtube.com/watch?v=qLlb-5TRAX8', title: 'kröw, live' },
            { kind: 'soundcloud', url: 'https://api.soundcloud.com/tracks/1586274567', title: 'kröw on SoundCloud' },
        ],
        photos: ['krow-live-6.webp', 'krow-live-5.webp', 'krow-press-4.webp', 'krow-show-9.webp'],
    },
    {
        slug: 'stazrad',
        name: 'Stäzrad',
        photo: 'stazrad.webp',
        bio: [
            'If Stäzrad’s style could be distilled to a single word it would be: authentic, raw, and emo (a single word wouldn’t suffice). Emo as in emotionally vulnerable lyrical content conveyed through gut-wrenching vocal releases over musical climaxes that are sure to transport you into an existential catharsis…but of course, the tendrils of midwest emo (in the traditional sense) and hardcore have slithered their way all throughout the folk-acoustic and poly-rhythmic musings of this unique artist.',
            'Drawing inspiration from the psychedelic 60s from the likes of Pink Floyd and The Beatles (after they discovered acid ofc) all the way to modern prog-rock stylings from the iconic Radiohead soundscape and post-hardcore breakdowns of Circa Survive, we find ourselves with a one: Stäzrad. Have you ever heard a folk song turn hardcore? As if Fleetwood Mac were cowriting a tune with Bob Dylan when suddenly the whole squad was transported to the middle of an Underoath mosh pit? If that’s hard to fathom give Stäzrad’s finger-pickin’, heart-rippin’ original “Autumn-Like Changes” a listen :)',
            'An inter-dimensional pontificator adventuring through time and space, manifested into a physical form in our shared dimension and instilled with the conviction to share perspective through audio artform is where we find our artist. Born and raised in St. Louis, Stäzrad busted out of the midwest and hit the road full time to pursue a life of nomadic adventure chasing rock climbs and rock shows across the North American West. The siren song of the West Coast has finally lured Stäz into a California dreamin’ era that now establishes East Bay as home-base.',
        ],
        listen: [
            { kind: 'soundcloud', url: 'https://api.soundcloud.com/playlists/1732839255', title: 'Stäzrad on SoundCloud' },
        ],
    },
    {
        slug: 'wolfmanwoof',
        name: 'WOLFMANWOOF',
        photo: 'wolfmanwoof.webp',
        bio: [
            'WOLFMANWOOF is a collaborative project between two producers working in opposite corners of music. Techno and experimental synth-rock. The music lives somewhere in between.',
        ],
        releases: 'WOLFMANWOOF',
    },

    /* On the old site's grid but without pages yet. Uncomment an entry once it
       has a photo and a page file, and it appears.
    { slug: 'canary', name: 'Canary', photo: '' },
    { slug: 'the-silver-spurs', name: 'The Silver Spurs', photo: '' },
    { slug: 'hunter-ray', name: 'Hunter Ray', photo: '' },
    { slug: 'pablo-cervantes', name: 'Pablo Cervantes', photo: '' },
    */
];
