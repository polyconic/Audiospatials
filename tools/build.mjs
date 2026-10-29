/* puts everything from content/ into the actual html so google and ai crawlers
   (which don't run javascript) can read the whole site.

   node tools/build.mjs

   what it writes:
   - <slug>.html      a page per artist in content/artists.js (and deletes
                      pages for artists that got removed)
   - artists.html     the grid          } only between the <!-- build:x --> and
   - music.html       releases, videos  } <!-- /build:x --> markers, everything
   - studio.html      recent work       } else on those pages is by hand
   - index.html       artists list, photo reel, "out now" line, hidden summary, search engine data
   - sitemap.xml, llms.txt
   run it after changing anything in content/. github runs it on every push */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, s) => {
    const p = path.join(ROOT, f);
    if (fs.existsSync(p) && fs.readFileSync(p, 'utf8') === s) return;
    fs.writeFileSync(p, s);
    console.log('wrote', f);
};
const exists = f => fs.existsSync(path.join(ROOT, f));

const ctx = {};
vm.createContext(ctx);
for (const f of ['content/site.js', 'content/artists.js', 'content/music.js'])
    vm.runInContext(read(f) + '\n;globalThis.__x = { ...globalThis.__x, ' +
        { 'content/site.js': 'SITE', 'content/artists.js': 'ARTISTS', 'content/music.js': 'RELEASES, STUDIO_ORDER, VIDEOS' }[f] + ' };', ctx);
const { SITE, ARTISTS, RELEASES, STUDIO_ORDER, VIDEOS } = ctx.__x;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = p => SITE.url + p;
const ld = obj => `<script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', ...obj }, null, 1)}\n</script>`;

// ---------- pieces shared by the built markup

function cover(r, cls = '') {
    const full = '/img/releases/' + r.cover;
    const sm = '/img/releases/sm/' + r.cover;
    const alt = esc(r.title + ' by ' + r.artist);
    return exists(sm.slice(1))
        ? `<img${cls} src="${sm}" srcset="${sm} 1200w, ${full} 3000w" sizes="(max-width: 480px) 100vw, (max-width: 1000px) 50vw, 33vw" alt="${alt}" loading="lazy" decoding="async">`
        : `<img${cls} src="${full}" alt="${alt}" loading="lazy" decoding="async">`;
}

function releaseTile(r) {
    return `<a class="tile" href="${esc(r.url)}" target="_blank" rel="noopener"><div class="shot">${cover(r)}</div>` +
        `<div class="cap"><span class="t">${esc(r.title)}</span><span class="m">${esc(r.artist)}</span></div></a>`;
}

const NAMES = { youtube: 'YouTube', spotify: 'Spotify', soundcloud: 'SoundCloud' };
function embed(kind, url) {
    if (kind === 'youtube') {
        const id = /youtu/.test(url) ? (url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] : url;
        return { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`, thumb: `/img/videos/${id}.webp`, shape: 'video', page: `https://www.youtube.com/watch?v=${id}` };
    }
    if (kind === 'spotify') {
        const m = url.match(/open\.spotify\.com\/(album|artist|track|playlist)\/(\w+)/);
        return { src: `https://open.spotify.com/embed/${m[1]}/${m[2]}?theme=0`, shape: 'audio', tall: m[1] !== 'track', page: url };
    }
    return { src: 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(url) + '&color=%23ff2d00&auto_play=true&visual=false&show_artwork=true',
             shape: 'audio', tall: url.includes('/playlists/') || url.includes('/sets/'),
             page: /^https:\/\/soundcloud\.com\//.test(url) ? url : undefined };
}

// soundcloud and spotify get our own row instead of their ugly widgets. play button,
// title, time, progress line. js/players.js runs the real player hidden behind it
function track(item) {
    let data, page;
    if (item.kind === 'spotify') {
        const m = item.url.match(/open\.spotify\.com\/(album|artist|track|playlist)\/(\w+)/);
        data = `data-kind="spotify" data-uri="spotify:${m[1]}:${m[2]}"`;
        page = item.url;
    } else {
        const src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(item.url) +
            '&auto_play=false&visual=false&show_artwork=false&hide_related=true&show_comments=false' +
            '&show_user=false&show_reposts=false&show_teaser=false&color=%23ff2d00';
        data = `data-kind="soundcloud" data-src="${esc(src)}"`;
        page = /^https:\/\/soundcloud\.com\//.test(item.url) ? item.url : null;
    }
    const where = NAMES[item.kind];
    return `<div class="track" ${data}>` +
        `<button type="button" class="track-play" aria-label="${esc('Play ' + item.title)}"><i></i></button>` +
        `<div class="track-name"><span class="track-title">${esc(item.title)}</span>` +
        `<span class="track-sub label">${item.sub ? esc(item.sub) + ' · ' : ''}` +
        (page ? `<a href="${esc(page)}" target="_blank" rel="noopener">${where}</a>` : where) + `</span></div>` +
        `<span class="track-time label"></span>` +
        `<div class="track-bar" aria-hidden="true"><span></span></div></div>`;
}

// button that turns into the player when clicked (js/players.js). title is in
// the html so it still shows without javascript
function player(item) {
    const e = embed(item.kind, item.url);
    const title = item.title || NAMES[item.kind];
    const sub = item.sub || 'Play on ' + NAMES[item.kind];
    return `<button type="button" class="player ${e.shape}${e.tall ? ' tall' : ''}" data-src="${esc(e.src)}" data-title="${esc(title)}" aria-label="${esc('Play ' + title + ' on ' + NAMES[item.kind])}">` +
        (e.thumb ? `<img src="${e.thumb}" alt="" loading="lazy" decoding="async">` : '') +
        `<span class="play"><i></i><b>${esc(title)}<small class="label">${esc(sub)}</small></b></span></button>`;
}

const marks = back => `<div class="corner">
<a class="mailmark" href="mailto:${SITE.email}?subject=Audiospatials" aria-label="Email">
<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5H4L12 11.6 20 5H22V19H2Z"/></svg>
</a>
</div>
<a class="backmark" href="${back}" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12 12 4.5V10H21V14H12V19.5Z"/></svg></a>
<a class="homemark" href="/" aria-label="Front page"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 11.5H19V21H13.8V15H10.2V21H5V11.5H2Z"/></svg></a>`;

const SECTIONS = [['/music', 'Music'], ['/studio', 'Studio'], ['https://vault.audiospatials.com/', 'Vault'], ['/about', 'About'], ['/contact', 'Contact']];
const exitBar = here => `<nav class="exit">
    <a href="/">Audiospatials</a>
    ${SECTIONS.map(([h, t]) => t === here ? `<span class="here">${t}</span>` : `<a href="${h}">${t}</a>`).join('')}
    <span class="spacer"></span>
    <span class="copy">&copy; <span data-yr>2026</span> Audiospatials</span>
</nav>`;

// ---------- artist pages

// muted speaker icon for videos (js/players.js swaps it)
const SOUND_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9H6L11 4.5V19.5L6 15H2Z"/><path d="M14.3 9.4 15.4 8.3 17.5 10.4 19.6 8.3 20.7 9.4 18.6 11.5 20.7 13.6 19.6 14.7 17.5 12.6 15.4 14.7 14.3 13.6 16.4 11.5Z"/></svg>';

// read a webp's size so videos don't jump around while loading
function webpSize(f) {
    const b = fs.readFileSync(path.join(ROOT, f));
    const chunk = b.toString('ascii', 12, 16);
    if (chunk === 'VP8X') return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)];
    if (chunk === 'VP8 ') return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8L') { const v = b.readUInt32LE(21); return [1 + (v & 0x3fff), 1 + ((v >> 14) & 0x3fff)]; }
    return null;
}

// one thing from `photos`. a file in img/artists/ or a path under img/ (like
// 'video/luci-red.mp4'). videos loop muted while on screen, with a .webp still
// of the same name before that, plus a sound button
function media(f, name) {
    const src = '/img/' + (f.includes('/') ? f : 'artists/' + f);
    if (/\.(mp4|webm|mov)$/i.test(f)) {
        const poster = src.replace(/\.\w+$/, '.webp');
        const size = exists(poster.slice(1)) && webpSize(poster.slice(1));
        return `<div class="clip"><video src="${src}"${size ? ` poster="${poster}" width="${size[0]}" height="${size[1]}"` : ''} muted loop playsinline preload="none" data-inview aria-label="${esc(name)}"></video>` +
            `<button type="button" class="sound" aria-pressed="false" aria-label="Turn sound on">${SOUND_OFF}</button></div>`;
    }
    return `<img src="${src}" alt="${esc(name)}" loading="lazy" decoding="async">`;
}

// splits the photos into two columns, each one goes to whichever column is
// shorter. `--i` keeps the original order for phones
function gallery(photos, name, captions = {}) {
    const show = f => captions[f] ? `<figure>${media(f, name)}<figcaption>${esc(captions[f])}</figcaption></figure>` : media(f, name);
    if (photos.length === 1) return `<div class="photos">\n            ${show(photos[0])}\n        </div>`;
    const ratio = f => {
        const rel = 'img/' + (f.includes('/') ? f : 'artists/' + f);
        const still = /\.(mp4|webm|mov)$/i.test(f) ? rel.replace(/\.\w+$/, '.webp') : rel;
        const size = still.endsWith('.webp') && exists(still) && webpSize(still);
        return size ? size[1] / size[0] : 1;
    };
    const cols = [[], []], h = [0, 0];
    photos.forEach((f, i) => {
        const c = h[1] < h[0] ? 1 : 0;
        cols[c].push(show(f).replace(/^<(\w+)/, `<$1 style="--i:${i}"`));
        h[c] += ratio(f);
    });
    return `<div class="photos cols">\n${cols.map(c => `            <div class="col">\n                ${c.join('\n                ')}\n            </div>`).join('\n')}\n        </div>`;
}

// all of these are our releases. recordLabel only works on MusicRelease
const labelRelease = r => ({ '@type': 'MusicRelease', url: r.url, recordLabel: { '@type': 'Organization', name: SITE.name, url: SITE.url + '/' } });
const releasesBy = name => RELEASES.filter(r => r.artist === name);

function artistLD(a) {
    const sameAs = [...(a.listen || []).map(l => embed(l.kind, l.url).page), ...(a.links || []).map(l => l.url)].filter(Boolean);
    const albums = releasesBy(a.releases || a.name);
    return ld({
        '@type': 'MusicGroup',
        name: a.name,
        url: abs('/' + a.slug),
        image: abs(`/img/artists/${a.photo}`),
        description: a.description,
        ...(sameAs.length && { sameAs }),
        ...(albums.length && { album: albums.map(r => ({ '@type': 'MusicAlbum', name: r.title, url: r.url, image: abs('/img/releases/' + r.cover), albumRelease: labelRelease(r) })) }),
    });
}

const isClip = f => /\.(mp4|webm|mov)$/i.test(f || '');

function coverMedia(f, name) {
    if (isClip(f)) return media(f, name);
    return `<img src="/img/${f.includes('/') ? '' : 'artists/'}${f}" alt="${esc(name)}" decoding="async" fetchpriority="high">`;
}

function artistPage(a) {
    const body = [];
    // the cover photo: the hero, or the grid photo. it doesn't repeat in the gallery
    const first = a.hero || a.photo;
    const photos = (a.photos || []).filter(f => f !== first);
    // soundcloud/spotify rows go right under the bio, youtube gets its own section below
    const sc = (a.listen || []).filter(l => l.kind === 'soundcloud' || l.kind === 'spotify');
    const rest = (a.listen || []).filter(l => l.kind === 'youtube');
    body.push(`    <section class="cover${isClip(first) ? ' wide' : ''}${a.flip ? ' flip' : ''}">
        <div class="c1">${coverMedia(first, a.name)}</div>
        <h1>${esc(a.name)}<em>.</em></h1>
    </section>`);
    body.push(`    <div class="artist-top">
        <div class="artist-text">${a.tagline ? `\n            <p class="lede">${esc(a.tagline)}</p>` : ''}${a.bio && a.bio.length ? `\n            <div class="prose">\n${a.bio.map(p => `                <p>${esc(p)}</p>`).join('\n')}\n            </div>` : ''}${sc.length ? `
            <div class="listen-here">
                <p class="label">Listen</p>
                <div class="tracks">
                    ${sc.map(track).join('\n                    ')}
                </div>${a.note ? `\n                <p class="note label">${esc(a.note)}</p>` : ''}
            </div>` : ''}${a.links && a.links.length ? `
            <div class="elsewhere">
                <p class="label">Elsewhere</p>
                <ul class="rows">
                    ${a.links.map(l => `<li><a class="row" href="${esc(l.url)}" rel="me noopener" target="_blank"><span class="n">${esc(l.title)}</span><span class="u">${esc(l.handle)}</span></a></li>`).join('\n                    ')}
                </ul>
            </div>` : ''}
        </div>
    </div>`);
    const listen = [];
    if (rest.length || (a.note && !sc.length)) listen.push(`    <section class="more">
        <p class="label">${sc.length ? 'More' : 'Listen'}</p>${rest.length ? `
        <div class="players">
            ${rest.map(player).join('\n            ')}
        </div>` : ''}${a.note && !sc.length ? `\n        <p class="note label">${esc(a.note)}</p>` : ''}
    </section>`);
    if (a.releases) {
        const own = releasesBy(a.releases);
        if (own.length) body.push(`    <section>
        <p class="label">Releases</p>
        <div class="tiles${own.length === 4 ? ' cube' : ''}">
            ${own.map(releaseTile).join('\n            ')}
        </div>
    </section>`);
    }
    if (!a.listenLast) body.push(...listen);
    if (photos.length) body.push(`    <section>
        ${gallery(photos, a.name, a.captions)}${a.credit ? `\n        <p class="note label">${esc(a.credit)}</p>` : ''}
    </section>`);
    if (a.listenLast) body.push(...listen);

    return `<!DOCTYPE html>
<!-- built by tools/build.mjs from content/artists.js, edit that not this -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${esc(a.name)} &mdash; Audiospatials</title>
    <link rel="icon" type="image/png" href="/assets/favicon.png">
    <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
    <link rel="canonical" href="${abs('/' + a.slug)}">
    <meta name="description" content="${esc(a.description)}">
    <meta name="theme-color" content="#0a0a0a">
    <meta property="og:title" content="${esc(a.name)} — Audiospatials">
    <meta property="og:description" content="${esc(a.description)}">
    <meta property="og:image" content="${abs('/assets/share/' + a.slug + '.jpg')}">
    <meta property="og:type" content="profile">
    <meta property="og:url" content="${abs('/' + a.slug)}">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="/css/base.css">
    <link rel="stylesheet" href="/css/pages.css">
${artistLD(a)}
</head>
<body class="artist">
${marks('/')}
<div class="wrap">
${body.join('\n\n')}
</div>

${exitBar(null)}
<script src="/js/players.js"></script>
<script src="/js/geo.js"></script>
<script src="/js/nav.js"></script>
<script src="/js/menu.js"></script>
<script>
if (location.pathname.endsWith('.html')) history.replaceState(history.state, '', location.pathname.slice(0, -5) + location.search + location.hash);
</script>
<script>document.querySelectorAll("[data-yr]").forEach(function(e){e.textContent=new Date().getFullYear()})</script>
</body>
</html>
`;
}

// ---------- blocks inside hand-written pages

function fill(file, name, content) {
    const src = read(file);
    const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
    if (!re.test(src)) throw new Error(`${file} has no build:${name} markers`);
    write(file, src.replace(re, `$1\n${content}\n$2`));
}

// the artists list. the 1200px copy of each grid photo fills the name on hover (full size if there's no copy)
const artistTiles = ARTISTS.map(a => {
    const fill = exists('img/artists/sm/' + a.photo) ? 'sm/' + a.photo : a.photo;
    return `        <li><a href="/${a.slug}" style="--photo:url('/img/artists/${fill}')"><span>${esc(a.name)}</span></a></li>`;
}).join('\n');

// the photos dissolving into each other on the right of the front page (js/reel.js). the script
// loads them one ahead and only on wide screens; the noscript copy covers no-js
const reel = `    <div class="reel" aria-hidden="true">
${ARTISTS.map((a, i) => `        <a href="/${a.slug}" tabindex="-1"${i ? '' : ' class="on"'}><img data-src="/img/artists/${a.photo}" alt="" decoding="async"${a.focus ? ` style="object-position: ${esc(a.focus)}"` : ''}>${i ? '' : `<noscript><img src="/img/artists/${a.photo}" alt="" loading="lazy"></noscript>`}</a>`).join('\n')}
    </div>`;

const onMusic = RELEASES.filter(r => r.music !== false);

// the small "out now" line top left of the front page, from the first release marked announce
const fresh = RELEASES.find(r => r.announce);
const news = fresh ? `<a class="news" href="${esc(fresh.url)}" target="_blank" rel="noopener"><i></i>Out now<span>${esc(fresh.title)} &mdash; ${esc(fresh.artist)}</span></a>` : '';
const videoPlayers = VIDEOS.map(v => '        ' + player({ kind: 'youtube', url: v.id, title: v.title, sub: v.artist })).join('\n');

const work = STUDIO_ORDER.map(t => RELEASES.find(r => r.title === t)).filter(r => r && r.credit).map(r =>
    `            <li><a class="row" href="${esc(r.url)}" target="_blank" rel="noopener"><span class="who">${cover(r, ' class="cover"').replace(/ srcset="[^"]*" sizes="[^"]*"/, '')}<span class="n"><span class="title">${esc(r.title)}</span><small class="label">${esc(r.artist)}</small></span></span><span class="u">${esc(r.credit)}</span></a></li>`).join('\n');

const orgLD = ld({
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url + '/',
    logo: abs('/assets/favicon.png'),
    image: abs('/assets/share/audiospatials.jpg'),
    description: SITE.description,
    email: SITE.email,
    founder: SITE.founders.map(f => ({ '@type': 'Person', name: f.name, url: abs('/' + f.slug),
        affiliation: { '@type': 'Organization', name: SITE.sister.name, url: SITE.sister.url } })),
    location: SITE.places.map(p => ({ '@type': 'Place', name: p })),
    knowsAbout: SITE.services,
    sameAs: SITE.elsewhere,
});

const musicLD = ld({
    '@type': 'ItemList',
    name: 'Released on Audiospatials',
    itemListElement: onMusic.map((r, i) => ({ '@type': 'ListItem', position: i + 1, item: {
        '@type': 'MusicAlbum', name: r.title, url: r.url, image: abs('/img/releases/' + r.cover),
        albumRelease: labelRelease(r),
        byArtist: { '@type': 'MusicGroup', name: r.artist } } })),
});

// hidden text on the front page for google etc, since the logo is a drawing
const summary = `    <div class="geo-text">
        <h1>${esc(SITE.name)}</h1>
        <p>${esc(SITE.description)}</p>
        <ul>${SECTIONS.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
    </div>`;

// ---------- write

const built = new Set(ARTISTS.map(a => a.slug + '.html'));
for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !built.has(f)))
    if (read(f).includes('built by tools/build.mjs from content/artists.js')) { fs.unlinkSync(path.join(ROOT, f)); console.log('removed', f); }
for (const a of ARTISTS) write(a.slug + '.html', artistPage(a));

fill('index.html', 'tiles', artistTiles);
fill('index.html', 'news', news);
fill('index.html', 'reel', reel);
fill('music.html', 'releases', onMusic.map(r => '        ' + releaseTile(r)).join('\n'));
fill('music.html', 'videos', videoPlayers);
fill('music.html', 'jsonld', musicLD);
fill('studio.html', 'work', work);
fill('index.html', 'summary', summary);
fill('index.html', 'jsonld', orgLD);

const pages = ['/', '/music', '/studio', '/about', '/contact', ...ARTISTS.map(a => '/' + a.slug)];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${abs(p === '/' ? '/' : p)}</loc></url>`).join('\n')}
</urlset>
`);

write('llms.txt', `# ${SITE.name}

> ${SITE.description}

Audiospatials is the collaborative project of ${SITE.founders.map(f => `${f.name} (${f.place})`).join(' and ')}. It releases records by its artists and works with independent artists on ${SITE.services.map(s => s.toLowerCase()).join(', ')}. Contact: ${SITE.email}.

## Pages

- [Artists](${abs('/')}): the roster, which is the front page
- [Music](${abs('/music')}): records released on Audiospatials, and videos
- [Studio](${abs('/studio')}): what we do, and recent work with credits
- [Vault](https://vault.audiospatials.com/): unreleased music and sketches
- [About](${abs('/about')}): how it started
- [Contact](${abs('/contact')}): send a project

## Artists

${ARTISTS.map(a => `- [${a.name}](${abs('/' + a.slug)}): ${a.description}`).join('\n')}

## Releases

${RELEASES.map(r => `- ${r.title} — ${r.artist}${r.credit ? ` (${r.credit})` : ''}: ${r.url}`).join('\n')}

## Elsewhere

${SITE.elsewhere.map(u => `- ${u}`).join('\n')}
`);
