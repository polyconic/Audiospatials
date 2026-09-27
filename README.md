# audiospatials.com

We make records with independent artists, from folk to techno.

Made by Gregor Egan and Hunter Bowersmith. With love.

## Editing

Most changes are one file:

- **`content/artists.js`** — every artist: name, photo, bio, players, extra photos.
- **`content/music.js`** — releases (covers, links, credits) and the videos on the Music page.
  A release with a `credit` also shows under Recent work on the Studio page.

Photos go in `img/artists/`, covers in `img/releases/`. Both can be edited on GitHub.

Adding an artist also needs a page: copy `john-bear.html` to `<slug>.html` and
change the slug, title and description near the top.

## Layout

- The pages (`*.html`) sit at the top level — GitHub Pages serves `studio.html`
  at `/studio` only from there.
- `content/` — the two files above.
- `img/` — artist photos, release covers, video thumbnails, the front-page header.
- `css/`, `js/` — styles and scripts.
- `assets/` — favicon, home-screen icon, and `share/`, the pictures link
  previews show (iMessage, Instagram DMs, etc).
- `tools/serve.py` — local preview: `python3 tools/serve.py`, then localhost:8765.
