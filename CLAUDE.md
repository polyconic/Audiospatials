# audiospatials.com

The Audiospatials collective's site, rebuilt 2026-09-27 from the Squarespace
version to mirror visuospatials.com. Static HTML, no build step, no
dependencies, no analytics. `README.md` is the public face; this is the working
document.

**Two people edit this site: Gregor Egan and Hunter Bowersmith.** Hunter needs
to change content without touching code, which is the whole reason the site
was on Squarespace. So content lives in two data files he can edit on GitHub's
web editor — `content/artists.js` and `content/music.js` — and page files stay dumb. Keep it
that way: new content goes in a data file, not hard-coded into a page.

## Shared with Visuospatials

`css/base.css`, `js/geo.js` and `js/nav.js` are copied from
`~/Documents/GitHub/visuospatials` unchanged (there they sit at the root). Read that repo's CLAUDE.md for the geometric alphabet, the
corner marks, the exit bar, view transitions and prerendering — all the same
here. If one of these changes there, copy it over.

## Pages

| File | What it is |
|---|---|
| `index.html` | The front: the WOLFMANWOOF header (`img/header.webp`), one copy covering the screen, crop centered on the kicking figure (tiled and mirrored versions were tried 2026-09-27 and dropped) and the converging wordmark. The name links to `/artists`. `spatial` explodes it, Konami inverts. |
| `artists.html` | The grid, built from `content/artists.js`. |
| `<slug>.html` | One per artist, same slugs as the old Squarespace site so old links hold. Each is a stub carrying its slug, title and meta; `js/artist.js` renders it from `content/artists.js`. |
| `music.html` | Released-on-Audiospatials grid, then videos. From `content/music.js`. |
| `studio.html` | What we do, Recent work (releases with a `credit`, in `STUDIO_ORDER`), Start a project. |
| `about.html` | The About text verbatim from the old site, plus the two founders. |
| `contact.html` | Mail and elsewhere. There is no form — no backend. |
| `404.html` | The 404 in the alphabet. |
| `css/pages.css` | Styles the inside pages share (heading, rows, tiles, players). |
| `js/players.js` | Click-to-load Spotify / SoundCloud / YouTube players. Nothing third-party loads until a visitor clicks. YouTube uses the nocookie domain. |
| `js/covers.js` | Release covers: 1200px copy from `img/releases/sm/` in grids, full file for big screens; falls back to the full file when no small copy exists. |
| `tools/serve.py` | Local preview that maps `/studio` to `studio.html` like Pages does. `python3 tools/serve.py` → localhost:8765. |

## Folders

**Pages stay at the root.** Pages serves `x.html` at `/x` only from the top
level; moving them into a folder would change every address and break the old
Squarespace links (`/john-bear`, `/studio`). Everything else is foldered:
`content/` (the two data files), `css/`, `js/`, `img/`, `assets/` (icons and
`share/`), `tools/`. Paths are root-absolute everywhere.

## Link previews

`og:image` points at JPGs in `assets/share/` — 1200×630 for the site pages
(`audiospatials.jpg`, cut from the header), 1200×1200 squares per artist
(`<slug>.jpg`) and for Music. JPG, not webp: iMessage and some other preview
fetchers don't show webp. A new artist needs one made the same way.

## Content decisions

- Mastering is **not** offered as a service, by choice. Studio
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

Not live yet. Plan: GitHub Pages from `main` under the `polyconic` account.
The domain is at **Namecheap** (not Squarespace), so switching is DNS only.
Add `CNAME` (`audiospatials.com`) only when switching, because with it
present the github.io address redirects to the domain, which still points at
Squarespace until DNS changes. Greg pushes; Claude commits locally and stops.

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
  `eforward*.registrar-servers.com`). When switching the site's DNS to GitHub
  Pages, change only the A / CNAME records — **leave the MX and TXT records
  alone** or hunter@ and gregor@ stop receiving mail.
