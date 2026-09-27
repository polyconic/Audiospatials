/* Builds an artist page from its entry in artists.js. The page file only
   carries the slug (on #artist) and its own title and description for search. */
(function () {
    const root = document.getElementById('artist');
    const a = ARTISTS.find(x => x.slug === root.dataset.slug);
    if (!a) { root.innerHTML = '<p class="label">This artist is not in artists.js.</p>'; return; }

    const el = (tag, cls, text) => {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (text != null) e.textContent = text;
        return e;
    };

    const h1 = el('h1', 'name');
    h1.dataset.arrive = '';
    h1.append(a.name, el('em', null, '.'));
    root.append(h1);

    const top = el('div', 'artist-top');
    const shot = el('div', 'artist-photo');
    const img = el('img');
    img.src = '/img/artists/' + a.photo;
    img.alt = a.name;
    img.decoding = 'async';
    shot.append(img);
    const text = el('div', 'artist-text');
    if (a.tagline) text.append(el('p', 'lede', a.tagline));
    if (a.bio && a.bio.length) {
        const prose = el('div', 'prose');
        a.bio.forEach(p => prose.append(el('p', null, p)));
        text.append(prose);
    }
    top.append(shot, text);
    root.append(top);

    if (a.listen && a.listen.length) {
        const s = el('section');
        s.append(el('p', 'label', 'Listen'));
        const list = el('div', 'players');
        a.listen.forEach(item => list.append(Player(item)));
        s.append(list);
        if (a.note) s.append(el('p', 'note label', a.note));
        root.append(s);
    }

    if (a.releases && typeof RELEASES !== 'undefined') {
        const own = RELEASES.filter(r => r.artist === a.releases);
        if (own.length) {
            const s = el('section');
            s.append(el('p', 'label', 'Releases'));
            const grid = el('div', 'tiles');
            own.forEach(r => grid.append(releaseTile(r)));
            s.append(grid);
            root.append(s);
        }
    }

    if (a.photos && a.photos.length) {
        const s = el('section');
        const grid = el('div', 'photos');
        a.photos.forEach(f => {
            const p = el('img');
            p.src = '/img/artists/' + f;
            p.alt = a.name;
            p.loading = 'lazy';
            p.decoding = 'async';
            grid.append(p);
        });
        s.append(grid);
        if (a.credit) s.append(el('p', 'note label', a.credit));
        root.append(s);
    }

    function releaseTile(r) {
        const t = el('a', 'tile');
        t.href = r.url;
        t.target = '_blank';
        t.rel = 'noopener';
        t.innerHTML = '<div class="shot"><img loading="lazy" decoding="async"></div><div class="cap"><span class="t"></span><span class="m"></span></div>';
        const i = t.querySelector('img');
        coverImg(i, r.cover);
        i.alt = r.title + ' by ' + r.artist;
        t.querySelector('.t').textContent = r.title;
        t.querySelector('.m').textContent = r.artist;
        return t;
    }
})();
