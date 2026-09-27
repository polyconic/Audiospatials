/* Click-to-load players. Each starts as a plain button; the Spotify,
   SoundCloud or YouTube frame is only created when someone clicks it, and
   then starts playing. Player({ kind, url, title, sub }) returns the button. */
(function () {
    const embed = {
        youtube(url) {
            const id = url.includes('youtu') ? (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] : url;
            return { src: 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0',
                     thumb: '/img/videos/' + id + '.webp', shape: 'video' };
        },
        spotify(url) {
            const m = url.match(/open\.spotify\.com\/(album|artist|track|playlist)\/(\w+)/);
            return { src: 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?theme=0',
                     shape: 'audio', tall: m[1] !== 'track' };
        },
        soundcloud(url) {
            return { src: 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) +
                          '&color=%23ff2d00&auto_play=true&visual=false&show_artwork=true',
                     shape: 'audio', tall: url.includes('/playlists/') };
        },
    };
    const names = { youtube: 'YouTube', spotify: 'Spotify', soundcloud: 'SoundCloud' };

    window.Player = function (item) {
        const e = embed[item.kind](item.url);
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'player ' + e.shape + (e.tall ? ' tall' : '');
        if (e.thumb) {
            const img = document.createElement('img');
            img.src = e.thumb; img.alt = ''; img.loading = 'lazy'; img.decoding = 'async';
            b.append(img);
        }
        const play = document.createElement('span');
        play.className = 'play';
        play.innerHTML = '<i></i><b></b>';
        play.querySelector('b').textContent = item.title || names[item.kind];
        const sub = document.createElement('small');
        sub.className = 'label';
        sub.textContent = item.sub || 'Play on ' + names[item.kind];
        play.querySelector('b').append(sub);
        b.append(play);
        b.setAttribute('aria-label', 'Play ' + (item.title || '') + ' on ' + names[item.kind]);

        b.addEventListener('click', () => {
            const f = document.createElement('iframe');
            f.src = e.src;
            f.title = item.title || names[item.kind];
            f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';
            f.allowFullscreen = true;
            const box = document.createElement('div');
            box.className = b.className + ' loaded';
            box.append(f);
            b.replaceWith(box);
            f.focus();
        }, { once: true });
        return b;
    };
})();
