/* Click-to-load players. tools/build.mjs writes each one into the page as a
   button carrying the embed address; nothing from Spotify, SoundCloud or
   YouTube loads until it is clicked. Then the button becomes the player. */
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
