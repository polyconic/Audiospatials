/* releases and videos, newest first.

   RELEASES go on the music page. anything with a `credit` also shows up under
   recent work on the studio page, in STUDIO_ORDER order.

   title    the release
   artist   how it's written on the release
   cover    in img/releases/
   url      where to listen (spotify, bandcamp, wherever)
   credit   optional, who did what: 'produced, mixed and mastered by Gregor Egan'
   music    false keeps it off the music page (studio page only)

   VIDEOS go at the bottom of the music page. `id` is the bit of the youtube
   link after v= , thumbnail goes in img/videos/<id>.webp
*/

const RELEASES = [
    { title: 'Shifter EP', artist: 'Gregor Egan', cover: 'shifter.webp',
      url: 'https://open.spotify.com/album/6bQV8We6TvwaG73aCShgxS',
      credit: 'produced, mixed and mastered by Gregor Egan' },
    { title: 'Latency', artist: 'WOLFMANWOOF', cover: 'latency.webp',
      url: 'https://open.spotify.com/album/57s6rqYzN0SdpJrCWNlE7E',
      credit: 'produced, mixed, and mastered by Gregor Egan' },
    { title: 'Love You', artist: 'WOLFMANWOOF', cover: 'love-you.webp',
      url: 'https://open.spotify.com/album/7oEeCfFE0QxOwHwywky7jn',
      credit: 'produced and mixed by Hunter Bowersmith' },
    { title: 'Moonrise EP', artist: 'WOLFMANWOOF', cover: 'moonrise.webp',
      url: 'https://open.spotify.com/album/5MZyYI2rvFfai4WuTNTRF7',
      credit: 'produced, mixed and mastered by Gregor Egan' },
    { title: 'Highwater', artist: 'WOLFMANWOOF', cover: 'highwater.webp',
      url: 'https://open.spotify.com/album/5cUgPduiXyYyJaNWUkYRT9',
      credit: 'produced by Hunter Bowersmith, mixed and mastered by Gregor Egan' },
    { title: 'Blueberry Pie EP', artist: 'John Bear', cover: 'blueberry-pie.webp',
      url: 'https://open.spotify.com/album/1BOYiMGrk8CGzkVfN4N7aj',
      credit: 'produced and mixed by Hunter Bowersmith, mastered by Gregor Egan',
      music: false },
];

// recent work order on the studio page, by title
const STUDIO_ORDER = ['Blueberry Pie EP', 'Latency', 'Highwater', 'Love You', 'Moonrise EP', 'Shifter EP'];

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
