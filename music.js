/* Releases and videos. Newest first in each list.

   RELEASES feed the Music page, and any release with a `credit` is also listed
   under Recent work on the Studio page, in the order of STUDIO_ORDER.

   title    the release
   artist   as written on it
   cover    in img/releases/
   url      where to listen (Spotify, Bandcamp, anywhere)
   credit   optional, who made it: 'produced, mixed and mastered by Gregor Egan'
   music    set to false to keep a release off the Music page (Studio only)

   VIDEOS feed the lower half of the Music page. `id` is the part of the
   YouTube address after v= ; the thumbnail lives in img/videos/<id>.webp.
   The player only loads when someone clicks it.
*/

const RELEASES = [
    { title: 'Shifter EP', artist: 'Gregor Egan', cover: 'shifter.webp',
      url: 'https://open.spotify.com/album/6bQV8We6TvwaG73aCShgxS',
      credit: 'produced, mixed and mastered by Gregor Egan' },
    { title: 'Latency', artist: 'WOLFMANWOOF', cover: 'latency.webp',
      url: 'https://open.spotify.com/album/57s6rqYzN0SdpJrCWNlE7E',
      credit: 'produced, mixed, and mastered by Gregor Egan' },
    { title: 'Medium EP', artist: 'Gregor Egan', cover: 'medium.webp',
      url: 'https://open.spotify.com/album/7ljzUgOt1JfiFfmEvd7rZy',
      credit: 'produced, mixed and mastered by Gregor Egan' },
    { title: 'Love You', artist: 'WOLFMANWOOF', cover: 'love-you.webp',
      url: 'https://open.spotify.com/album/7oEeCfFE0QxOwHwywky7jn' },
    { title: 'Moonrise EP', artist: 'WOLFMANWOOF', cover: 'moonrise.webp',
      url: 'https://open.spotify.com/album/5MZyYI2rvFfai4WuTNTRF7' },
    { title: 'Highwater', artist: 'WOLFMANWOOF', cover: 'highwater.webp',
      url: 'https://open.spotify.com/album/5cUgPduiXyYyJaNWUkYRT9',
      credit: 'produced by Hunter Bowersmith, mixed and mastered by Gregor Egan' },
    { title: 'Blueberry Pie EP', artist: 'John Bear', cover: 'blueberry-pie.webp',
      url: 'https://open.spotify.com/album/1BOYiMGrk8CGzkVfN4N7aj',
      credit: 'produced and mixed by Hunter Bowersmith, mastered by Gregor Egan',
      music: false },
];

// Recent work on the Studio page, by title.
const STUDIO_ORDER = ['Blueberry Pie EP', 'Latency', 'Highwater', 'Shifter EP', 'Medium EP'];

const VIDEOS = [
    { id: '5LAzm3qv7Lk', title: 'Dragonfly', artist: 'CANARY' },
    { id: 'BnqMwasQX6I', title: 'Blueberry Pie', artist: 'John Bear' },
    { id: '-McNYq2SqAI', title: 'highwater', artist: 'WOLFMANWOOF' },
    { id: 'taeq0cIomT4', title: 'Submerged 01 (unmastered)', artist: 'Gregor Egan' },
    { id: 'WvNy4AlrWmg', title: 'Rachel Made Coffee', artist: 'John Bear' },
    { id: 'Lg_cRgThtxc', title: 'ALIEN MOOG CALL', artist: 'WOLFMANWOOF' },
    { id: 'cTYIbTHdEvg', title: 'corridor song (live)', artist: 'Hunty Ray, Chloe May, Darren Ludington' },
    { id: 'jFombF2jZH8', title: 'love you', artist: 'WOLFMANWOOF' },
    { id: 'tT1qaH9kQFw', title: 'between the stars', artist: 'John Bear' },
];
