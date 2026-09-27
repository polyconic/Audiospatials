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
| — | Artist options in `artists.js`: `hero` (page photo ≠ grid photo; a clip as hero runs full width with the words under it, `.artist-top.wide` — LUCI), `flip` (photo right of the bio — Stäzrad), `photos` may include clips as `video/<name>.mp4` under `img/video/` with a `.webp` still of the same name; they loop only while on screen, start muted, and each carries a sound button (bottom right; turning one on mutes the others); the build reads the still's size so the clip holds its shape. **Encode clips with their audio** (`-c:a aac -b:a 160k`) — the button has nothing to play otherwise. An artist with exactly four releases gets them as a centred 2×2 square (`.tiles.cube` — WOLFMANWOOF). |
| `about.html` | The About text verbatim from the old site, with the two founders beside it, staggered as on the old Squarespace page: Hunter high at the far right, Gregor lower and inset (`margin-top: 34%`, a share of the pair's width so it scales). Stacks under the text on a phone, stagger kept. |
| `contact.html` | The form (see Contact) and elsewhere. |
| `404.html` | The 404 in the alphabet. |
| `css/pages.css` | Styles the inside pages share (heading, rows, tiles, players). Page titles open their letter-spacing as you scroll (-0.045em → 0.03em over the first 25vh, CSS scroll-driven animation, no JS; still in Firefox and under reduced motion). Every title was checked to stay one line and inside the page at full spread at 1440/1024/375 — except Contact's "Let's create.", which already wraps and so carries `class="still"`. Re-check a new long title the same way. |
| `js/menu.js` | **Phones (≤760px) have no bottom bar**: a two-bar button beside the mail mark drops the bar's own links down from the top right (2026-09-27 — iOS Safari's floating toolbar kept showing the page under a fixed bottom bar, whatever was tried). It restyles `.exit` rather than copying it, so sections still live in one place. The © line is not in the dropdown; on phones `menu.js` adds it as a small centred line (`.footcopy`) at the end of the page. Closes on outside tap, Esc, a link, or returning via back. Styles in `css/pages.css`. Every page with an `.exit` loads it, the build's artist template included. |
| `js/players.js` | Click-to-load players; nothing third-party loads before a press. **SoundCloud and Spotify** (2026-09-27) are our own row (`.track`, `data-kind`), built **under the artist's bio** in the text column (`.listen-here`) so it's seen without scrolling — Greg found them lost at the bottom. YouTube players stay in their own section below (`.more`, centred; labelled "More" when rows are above). Each row is: outlined play button, title, a permanent "SoundCloud ↗" link out under it, time, a hairline that fills red and seeks on click. Use each track's **public** soundcloud.com address in `artists.js` (not api.soundcloud.com ones — those can't be linked to; to find a track's public address, open `https://w.soundcloud.com/player/?url=<api url>` and read its links). As a row nears the screen (IntersectionObserver, 300px margin) its service's embed API (SoundCloud widget API / Spotify iFrame API) and player load hidden and **unstarted**; the tap then calls play inside the tap. **Why:** Safari only allows sound started within the tap itself — loading on the tap and playing when ready meant Safari needed two taps (Greg hit this, 2026-09-27). The SoundCloud embed URL has `auto_play=false` for the same reason. One track plays at a time. Spotify plays 30-second previews to visitors not logged in to Spotify — that's Spotify's rule, not ours. If play hasn't started 3.5s after a tap, the row shows the service's own player (`.native`) to tap. **Spotify and YouTube** stay as buttons that become their own frame. YouTube uses the nocookie domain. |
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

**Every page's `og:image` is the wordmark**, `assets/share/audiospatials.jpg`:
the lowercase *audiospatials* logo, white on #0a0a0a, 1200×630, made from
`~/Desktop/VISUO + AUDIO + DELILAH + INDEXLESS/audiospatials/designs/audiospatials/audio designs logo INSTA.pdf`
(rendered with `sips`, trimmed, set 680px wide). Greg wants the logo on every
link preview, not photos (2026-09-27) — per-artist photo previews were made
and dropped. JPG, not webp: iMessage doesn't show webp. The artist pages'
structured data still names each artist's photo as their image.

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
