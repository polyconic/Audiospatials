/* Players. tools/build.mjs writes them into the page; nothing from Spotify,
   SoundCloud or YouTube loads until one is pressed.

   YouTube: the button becomes YouTube's own player.

   SoundCloud and Spotify: our own row (.track). The first press loads the
   service's embed API and its player out of sight, and the row drives it:
   play and pause, elapsed and total time, a hairline that fills as it plays
   and seeks when clicked. One track plays at a time across the page. If the
   browser won't start the hidden player (iOS can refuse), the row shows the
   service's own player instead, so a tap there does it. Spotify plays
   30-second previews to anyone not logged in to Spotify; that's theirs.

   Clips among the photos (video[data-inview]) play silent and looping only
   while on screen, and load nothing before they first come into view. */
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

    const clips = document.querySelectorAll('video[data-inview]');
    if (clips.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            const v = e.target;
            if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); }
            else v.pause();
        }), { rootMargin: '120px' });
        clips.forEach(v => io.observe(v));
    }

    const rows = [...document.querySelectorAll('.track[data-kind]')];
    if (!rows.length) return;

    const script = (src, before) => new Promise((ok, fail) => {
        if (before) before(ok);
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { if (!before) ok(); };
        s.onerror = fail;
        document.head.append(s);
    });
    let scApi = null, spApi = null;
    const soundcloudApi = () => scApi || (scApi = script('https://w.soundcloud.com/player/api.js').then(() => window.SC));
    const spotifyApi = () => spApi || (spApi = script('https://open.spotify.com/embed/iframe-api/v1',
        ok => { window.onSpotifyIframeApiReady = ok; }));

    // Each engine loads its player into `slot`, starts it, and reports back
    // through `on`; it returns controls, or throws if its API won't load.
    const engines = {
        async soundcloud(row, slot, on) {
            const frame = document.createElement('iframe');
            frame.src = row.dataset.src;
            frame.allow = 'autoplay; encrypted-media';
            frame.title = on.title;
            slot.append(frame);
            const SC = await soundcloudApi();
            const w = SC.Widget(frame), E = SC.Widget.Events;
            let duration = 0;
            w.bind(E.READY, () => { w.getDuration(d => { duration = d; on.progress(0, d); }); w.play(); on.ready(); });
            w.bind(E.PLAY, () => { w.getDuration(d => { duration = d; }); on.play(); });
            w.bind(E.PAUSE, on.pause);
            w.bind(E.FINISH, () => { on.pause(); on.progress(0, duration); });
            w.bind(E.PLAY_PROGRESS, p => on.progress(p.currentPosition, duration));
            return { play: () => w.play(), pause: () => w.pause(), seek: ms => w.seekTo(ms) };
        },
        async spotify(row, slot, on) {
            const IFrameAPI = await spotifyApi();
            const el = document.createElement('div');
            slot.append(el);
            return new Promise(done => IFrameAPI.createController(el, { uri: row.dataset.uri, width: '100%', height: 152 }, c => {
                let paused = true;
                c.addListener('ready', () => { c.play(); on.ready(); });
                c.addListener('playback_update', e => {
                    const d = e.data;
                    if (d.isPaused !== paused) { paused = d.isPaused; paused ? on.pause() : on.play(); }
                    on.progress(d.position, d.duration);
                });
                done({ play: () => c.resume(), pause: () => c.pause(), seek: ms => c.seek(ms / 1000) });
            }));
        },
    };

    const clock = ms => {
        const t = Math.max(0, Math.round(ms / 1000));
        const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, sec = String(t % 60).padStart(2, '0');
        return h ? `${h}:${String(m).padStart(2, '0')}:${sec}` : `${m}:${sec}`;
    };

    const all = rows.map(row => {
        const btn = row.querySelector('.track-play');
        const time = row.querySelector('.track-time');
        const fill = row.querySelector('.track-bar span');
        const bar = row.querySelector('.track-bar');
        const title = row.querySelector('.track-title').textContent;
        let ctl = null, loading = false, playing = false, started = false, duration = 0;

        const state = s => { row.dataset.state = s; btn.setAttribute('aria-label', (s === 'playing' ? 'Pause ' : 'Play ') + title); };
        const slot = document.createElement('div');
        slot.className = 'track-frame';
        const on = {
            title,
            ready: () => setTimeout(() => { if (!started) { row.classList.add('native'); state('idle'); } }, 3500),
            play: () => { started = playing = true; state('playing'); row.classList.remove('native'); all.forEach(t => t.row !== row && t.pause()); },
            pause: () => { playing = false; if (started) state('paused'); },
            progress: (pos, dur) => {
                if (dur) { duration = dur; fill.style.transform = `scaleX(${Math.min(1, pos / dur)})`; }
                time.textContent = duration ? `${clock(pos)} / ${clock(duration)}` : '';
            },
        };

        btn.addEventListener('click', async () => {
            if (ctl) { playing ? ctl.pause() : ctl.play(); return; }
            if (loading) return;
            loading = true;
            state('loading');
            row.append(slot);
            try { ctl = await engines[row.dataset.kind](row, slot, on); }
            catch (err) { row.classList.add('native'); state('idle'); }
        });
        bar.addEventListener('click', e => {
            if (!ctl || !duration) return;
            const r = bar.getBoundingClientRect();
            ctl.seek(((e.clientX - r.left) / r.width) * duration);
            if (!playing) ctl.play();
        });

        state('idle');
        return { row, pause: () => ctl && playing && ctl.pause() };
    });
})();
