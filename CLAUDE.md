# audiospatials.com

Audiospatials' site, rebuilt 2026-09-27 from the Squarespace
version to mirror visuospatials.com. Static HTML, no dependencies, no
analytics. `README.md` is the public face; this is the working document.

**Content lives in `content/`, and a build writes it into the pages.** Greg does
most of the editing (with Claude); Hunter can edit too, on GitHub's web
editor. `content/site.js` (who Audiospatials is), `content/artists.js` and
`content/music.js` are the source; `node tools/build.mjs` writes them into the
HTML. New content goes in a content file, never hand-written into a built
block. **After changing anything in `content/`, run the build and commit its
output with the change.**

## The build (and why)

Added 2026-09-27 for search and AI visibility. The pages used to fill
themselves in with JavaScript in the browser; AI crawlers (GPTBot, ClaudeBot,
PerplexityBot…) read the raw HTML without running scripts, so they saw only
the menu. Now every page carries its full text in its own HTML. Plain Node, no
packages. `tools/build.mjs`:

- writes each artist's page, `<slug>.html`, whole — adding an entry to
  `artists.js` creates the page; removing it deletes the page. Built pages say
  so in a comment on line 2; don't hand-edit them.
- fills the blocks between `<!-- build:x -->` / `<!-- /build:x -->` markers in
  `artists.html` (grid), `music.html` (releases, videos, structured data),
  `studio.html` (recent work) and `index.html` (structured data, and a visually
  hidden h1 + description + section links, since the wordmark is a drawing).
  Everything outside the markers is hand-written.
- writes `sitemap.xml` and `llms.txt`.
- only rewrites files whose content changed, so a second run is silent.

**Structured data** (JSON-LD): `Organization` on the front page (founders,
places, services, Instagram/YouTube), `MusicGroup` on each artist page (with
their releases and Spotify links), an `ItemList` of `MusicAlbum`s on Music. No
`member` list on the Organization — it reads as a collective.

**Publishing:** `.github/workflows/pages.yml` runs the build on every push to
`main` and deploys the result, so an edit made on GitHub's website is built
too. **Pages source is "GitHub Actions"** (Settings → Pages), not "Deploy from a
branch". The deployed site leaves out `tools/`, `.github/`, `CLAUDE.md` and
`README.md`.

## Shared with Visuospatials

`css/base.css`, `js/geo.js` and `js/nav.js` are copied from
`~/Documents/GitHub/visuospatials` (there they sit at the root), unchanged except
one glyph: **the D** was fixed here on 2026-09-27 — its bowl was centred inside
the bar, so the bar's corners stuck out past the curve. Visuospatials never
draws a D, so it still has the old one; carry the fix over if it ever does.
And **the bottom bar on phones** (2026-09-27): `.exit` pads by
`env(safe-area-inset-bottom)` and paints `--bg` below itself (`.exit::after`),
with `viewport-fit=cover` on every page (and in the build's artist template),
so the page can't show between the bar and the screen edge while Safari's
toolbar slides; the corner marks keep clear of a landscape notch the same way. Read that repo's CLAUDE.md for the geometric alphabet, the
corner marks, the exit bar, view transitions and prerendering — all the same
here. If one of these changes there, copy it over.

## Pages

| File | What it is |
|---|---|
| `index.html` | The front: the WOLFMANWOOF header (`img/header.webp`), one copy covering the screen, crop centered on the kicking figure (tiled and mirrored versions were tried 2026-09-27 and dropped) and the converging wordmark. The name links to `/artists`. `spatial` explodes it, Konami inverts. |
| `artists.html` | The grid (built block). |
| `<slug>.html` | One per artist, **entirely built**. Same slugs as the old Squarespace site so old links hold. |
| `music.html` | Released-on-Audiospatials grid, then videos (built blocks). |
| `studio.html` | What we do, Recent work (releases with a `credit`, in `STUDIO_ORDER`), Start a project. |
| `about.html` | The About text verbatim from the old site, plus the two founders. |
| `contact.html` | The form (see Contact) and elsewhere. |
| `404.html` | The 404 in the alphabet. |
| `css/pages.css` | Styles the inside pages share (heading, rows, tiles, players). |
| `js/menu.js` | **Phones (≤760px) have no bottom bar**: a two-bar button beside the mail mark drops the bar's own links down from the top right (2026-09-27 — iOS Safari's floating toolbar kept showing the page under a fixed bottom bar, whatever was tried). It restyles `.exit` rather than copying it, so sections still live in one place. Closes on outside tap, Esc, a link, or returning via back. Styles in `css/pages.css`. Every page with an `.exit` loads it, the build's artist template included. |
| `js/players.js` | Click-to-load players. The build writes each as a button carrying its embed address; clicking swaps in the Spotify / SoundCloud / YouTube frame. Nothing third-party loads before that. YouTube uses the nocookie domain. |
| `tools/build.mjs` | The build, above. |
| `llms.txt` | Built. The plain-text summary for AI tools. |
| `tools/serve.py` | Local preview that maps `/studio` to `studio.html` like Pages does. `python3 tools/serve.py` → localhost:8765. |

## Folders

**Pages stay at the root.** Pages serves `x.html` at `/x` only from the top
level; moving them into a folder would change every address and break the old
Squarespace links (`/john-bear`, `/studio`). Everything else is foldered:
`content/` (site, artists, music), `css/`, `js/`, `img/`, `assets/` (icons and
`share/`), `tools/`. Paths are root-absolute everywhere.

## Link previews

`og:image` points at JPGs in `assets/share/` — 1200×630 for the site pages
(`audiospatials.jpg`, cut from the header), 1200×1200 squares per artist
(`<slug>.jpg`) and for Music. JPG, not webp: iMessage and some other preview
fetchers don't show webp. A new artist needs one made the same way.

## Content decisions

- **Never call Audiospatials a "collective"** — Greg and Hunter find it a
  loaded term. Use the site's own words: a studio; "we make records with
  independent artists"; "the collaborative project of Gregor Egan and Hunter
  Bowersmith".

- Mastering is **not** offered as a service, by choice, yet. Studio
  lists production and mixing only. Credits may still say "mastered by".
- Canary, The Silver Spurs, Hunter Ray and Pablo Cervantes were on the old grid
  without pages; they sit commented out in `artists.js` until Hunter decides.
- "Hunty Ray" is Hunter Ray's alias and stays on the corridor song credit.
- Credits for Love You and Moonrise are still to come from Hunter.

## Images

Portraits: max 2560px long edge, webp q85
(`magick in -auto-orient -strip -resize 2560x2560\> -quality 85 -define webp:method=6 out.webp`).
Originals live in `~/Desktop/VISUO + AUDIO + DELILAH + INDEXLESS/audiospatials/artists/`
and are not committed. Release covers are the full-resolution files from
visuospatials `pieces/`, plus 1200px copies in `img/releases/sm/`
(q88). Video thumbnails are YouTube's maxres frames saved locally, so the
Music page makes no request to YouTube until a video is played.

## Deploy

Live since 2026-09-27 on GitHub Pages, repo `polyconic/Audiospatials` (public),
published by the Action above. DNS is at **Namecheap**: four A records to
185.199.108–111.153, four AAAA to 2606:50c0:8000–8003::153, `www` CNAME to
`polyconic.github.io.`. Squarespace is no longer in the DNS. Greg pushes;
Claude commits locally and stops.

## Contact

- **The form** on `/contact` posts to FormSubmit (formsubmit.co), which emails
  `hello@audiospatials.com`. No account. Every `@audiospatials.com` alias
  (hello, gregor, hunter) forwards at Namecheap to the one shared inbox,
  `audiospatials@gmail.com`, so one recipient reaches both of them — a CC to
  a second alias only delivers the message twice. A new recipient needs
  activating once (FormSubmit emails a link); after that, swap the address in
  the form's `action` for the alias code FormSubmit sends, to keep it out of the
  page source. With JS the form posts to the `/ajax/` endpoint and shows the
  result inline; without JS it posts normally and FormSubmit sends people back
  to `/contact?sent`.
- **The mail icon** and every other mailto link go to `hello@audiospatials.com`.
  Nothing on the site names the Gmail address or a personal alias.
- `@audiospatials.com` mail works through **Namecheap email forwarding** (MX
  `eforward*.registrar-servers.com`). If the site's DNS ever changes again,
  change only the A / AAAA / CNAME records — **leave the MX and TXT records
  alone** or @audiospatials.com mail stops arriving.
