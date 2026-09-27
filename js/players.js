/* Click-to-load players. tools/build.mjs writes them into the page; nothing
   from Spotify, SoundCloud or YouTube loads until one is pressed.

   Spotify and YouTube: the button becomes their own player.

   SoundCloud: our own row (.track). The first press loads SoundCloud's widget
   API and its player out of sight, and the row drives it: play and pause,
   elapsed and total time, a hairline that fills as it plays and seeks when
   clicked. One track plays at a time. If the browser won't start it from
   the hidden player (iOS can refuse), the row shows SoundCloud's own player
   instead, so a tap there does it. */
(function () {
    document.addEventListener('click', e => {
        const b = e.target.closest && e.target.closest('button.player[data-src]');
        if (!b) return;
        const f = document.createElement('iframe');
        f.src = b.dataset.src;
        f.title = b.dataset.title || '';
        f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; clipboard-write';
        f.allowFullscreen = true;
        const box = document.createElement('div');
        box.className = b.className + ' loaded';
        box.append(f);
        b.replaceWith(box);
        f.focus();
    });

    const tracks = [...document.querySelectorAll('.track[data-src]')];
    if (!tracks.length) return;

    let api = null;
    const loadApi = () => api || (api = new Promise((ok, fail) => {
        const s = document.createElement('script');
        s.src = 'https://w.soundcloud.com/player/api.js';
        s.onload = () => ok(window.SC);
        s.onerror = fail;
        document.head.append(s);
    }));

    const clock = ms => {
        const t = Math.max(0, Math.round(ms / 1000));
        const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, sec = String(t % 60).padStart(2, '0');
        return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
    };

    function Track(row) {
        const btn = row.querySelector('.track-play');
        const time = row.querySelector('.track-time');
        const fill = row.querySelector('.track-bar span');
        const bar = row.querySelector('.track-bar');
        let widget = null, frame = null, duration = 0, playing = false, started = false;

        const state = s => { row.dataset.state = s; btn.setAttribute('aria-label', (s === 'playing' ? 'Pause ' : 'Play ') + row.querySelector('.track-title').textContent); };
        const show = pos => {
            if (duration) fill.style.transform = `scaleX(${Math.min(1, pos / duration)})`;
            time.textContent = duration ? `${clock(pos)} / ${clock(duration)}` : clock(pos);
        };

        // The hidden player wouldn't start: show SoundCloud's own in the row.
        const fallBack = () => {
            if (started || !frame) return;
            row.classList.add('native');
            state('idle');
        };

        async function load() {
            state('loading');
            frame = document.createElement('iframe');
            frame.src = row.dataset.src;
            frame.title = row.querySelector('.track-title').textContent;
            frame.allow = 'autoplay; encrypted-media';
            frame.className = 'track-frame';
            row.append(frame);
            let SC;
            try { SC = await loadApi(); } catch (err) { fallBack(); return; }
            widget = SC.Widget(frame);
            const E = SC.Widget.Events;
            widget.bind(E.READY, () => {
                widget.getDuration(d => { duration = d; show(0); });
                widget.play();
                setTimeout(fallBack, 3500);
            });
            widget.bind(E.PLAY, () => {
                started = true; playing = true; state('playing');
                row.classList.remove('native');
                others(row).forEach(t => t.pause());
                widget.getDuration(d => { duration = d; });
            });
            widget.bind(E.PAUSE, () => { playing = false; state('paused'); });
            widget.bind(E.FINISH, () => { playing = false; state('paused'); show(0); });
            widget.bind(E.PLAY_PROGRESS, p => show(p.currentPosition));
        }

        btn.addEventListener('click', () => {
            if (!frame) { load(); return; }
            if (!widget) return;
            playing ? widget.pause() : widget.play();
        });
        bar.addEventListener('click', e => {
            if (!widget || !duration) return;
            const r = bar.getBoundingClientRect();
            widget.seekTo(((e.clientX - r.left) / r.width) * duration);
            if (!playing) widget.play();
        });

        state('idle');
        return { row, pause: () => widget && playing && widget.pause() };
    }

    const all = tracks.map(Track);
    const others = row => all.filter(t => t.row !== row);
})();
