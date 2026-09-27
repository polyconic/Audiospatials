/* Players. tools/build.mjs writes them into the page; nothing from Spotify,
   SoundCloud or YouTube loads until one is pressed.

   YouTube: the button becomes YouTube's own player.

   SoundCloud and Spotify: our own row (.track). As a row nears the screen,
   the service's embed API and its player load out of sight, unstarted, so a
   single tap can start it (Safari won't allow sound that starts later than
   the tap). The row drives it:
   play and pause, elapsed and total time, a hairline that fills as it plays
   and seeks when clicked. One track plays at a time across the page. If the
   browser won't start the hidden player (iOS can refuse), the row shows the
   service's own player instead, so a tap there does it. Spotify plays
   30-second previews to anyone not logged in to Spotify; that's theirs.

   Clips (video[data-inview]) loop only while on screen and load nothing
   before they first come into view. They start muted; each has a sound
   button, and turning one on turns the others off. */
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

    const clips = [...document.querySelectorAll('video[data-inview]')];
    if (clips.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => entries.forEach(e => {
            const v = e.target;
            if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); }
            else v.pause();
        }), { rootMargin: '120px' });
        clips.forEach(v => io.observe(v));
    }

    // Sound: off to start; one clip heard at a time. The button's first press
    // is a tap, so browsers allow the sound.
    const ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9H6L11 4.5V19.5L6 15H2Z"/><path d="M14 8.2A5 5 0 0 1 14 15.8L15.1 17.2A6.8 6.8 0 0 0 15.1 6.8Z"/><path d="M16.6 5.1A9 9 0 0 1 16.6 18.9L17.8 20.3A10.8 10.8 0 0 0 17.8 3.7Z"/></svg>';
    const soundButtons = [...document.querySelectorAll('.clip .sound')];
    const OFF = soundButtons.length ? soundButtons[0].innerHTML : '';
    const setSound = (b, on) => {
        const v = b.parentElement.querySelector('video');
        v.muted = !on;
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
        b.innerHTML = on ? ON : OFF;
        if (on && v.paused) v.play().catch(() => {});
    };
    soundButtons.forEach(b => b.addEventListener('click', () => {
        const on = b.getAttribute('aria-pressed') !== 'true';
        if (on) soundButtons.forEach(o => o !== b && setSound(o, false));
        setSound(b, on);
    }));

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

    // Each engine loads its player into `slot` without starting it, reports
    // back through `on`, and resolves with its controls once the player is
    // ready — or rejects if the service's API won't load.
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
            w.bind(E.PLAY, () => { w.getDuration(d => { duration = d; }); on.play(); });
            w.bind(E.PAUSE, on.pause);
            w.bind(E.FINISH, () => { on.pause(); on.progress(0, duration); });
            w.bind(E.PLAY_PROGRESS, p => on.progress(p.currentPosition, duration));
            return new Promise(done => w.bind(E.READY, () => {
                w.getDuration(d => { duration = d; on.progress(0, d); });
                done({ play: () => w.play(), pause: () => w.pause(), seek: ms => w.seekTo(ms) });
            }));
        },
        async spotify(row, slot, on) {
            const IFrameAPI = await spotifyApi();
            const el = document.createElement('div');
            slot.append(el);
            return new Promise(done => IFrameAPI.createController(el, { uri: row.dataset.uri, width: '100%', height: 152 }, c => {
                let paused = true, begun = false;
                c.addListener('playback_update', e => {
                    const d = e.data;
                    if (d.isPaused !== paused) { paused = d.isPaused; paused ? on.pause() : on.play(); }
                    on.progress(d.position, d.duration);
                });
                c.addListener('ready', () => done({
                    // The first play starts the release; after that, carry on where it stopped.
                    play: () => { if (begun) c.resume(); else { begun = true; c.play(); } },
                    pause: () => c.pause(),
                    seek: ms => c.seek(ms / 1000),
                }));
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
        let ctl = null, prep = null, want = false, playing = false, started = false, duration = 0, watch = 0;

        const state = s => { row.dataset.state = s; btn.setAttribute('aria-label', (s === 'playing' ? 'Pause ' : 'Play ') + title); };
        const slot = document.createElement('div');
        slot.className = 'track-frame';
        const native = () => { row.classList.add('native'); state('idle'); };
        const on = {
            title,
            play: () => { clearTimeout(watch); started = playing = true; state('playing'); row.classList.remove('native'); all.forEach(t => t.row !== row && t.pause()); },
            pause: () => { playing = false; if (started) state('paused'); },
            progress: (pos, dur) => {
                if (dur) { duration = dur; fill.style.transform = `scaleX(${Math.min(1, pos / dur)})`; }
                time.textContent = duration ? `${clock(pos)} / ${clock(duration)}` : '';
            },
        };

        // Load the player, unstarted, before anyone presses play: Safari only
        // lets sound start inside the tap itself, so by the time of the tap the
        // player has to be ready to take it.
        const prepare = () => prep || (prep = (async () => {
            row.append(slot);
            try { ctl = await engines[row.dataset.kind](row, slot, on); }
            catch (err) { native(); return; }
            if (want) start();
        })());

        // Play from a tap. If nothing has started a few seconds later, the
        // browser refused: show the service's own player to tap instead.
        const start = () => {
            ctl.play();
            clearTimeout(watch);
            watch = setTimeout(() => { if (!playing) native(); }, 3500);
        };

        btn.addEventListener('click', () => {
            if (ctl) { playing ? ctl.pause() : start(); return; }
            want = true;
            state('loading');
            prepare();
        });
        bar.addEventListener('click', e => {
            if (!ctl || !duration) return;
            const r = bar.getBoundingClientRect();
            ctl.seek(((e.clientX - r.left) / r.width) * duration);
            if (!playing) start();
        });

        state('idle');
        return { row, prepare, pause: () => ctl && playing && ctl.pause() };
    });

    // Get each player ready as its row nears the screen.
    if ('IntersectionObserver' in window) {
        const near = new IntersectionObserver(entries => entries.forEach(e => {
            if (!e.isIntersecting) return;
            near.unobserve(e.target);
            all.find(t => t.row === e.target).prepare();
        }), { rootMargin: '300px' });
        rows.forEach(r => near.observe(r));
    } else all.forEach(t => t.prepare());
})();
