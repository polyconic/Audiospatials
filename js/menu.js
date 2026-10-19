/* phone menu. turns the nav bar into a dropdown from a button next to the mail icon.
   reuses the bar's links so the list only lives in one place. layout is in css/pages.css */
(function () {
    const bar = document.querySelector('.exit');
    const corner = document.querySelector('.corner');
    if (!bar || !corner) return;

    const OPEN = '<path d="M3 6H21V9H3Z M3 15H21V18H3Z"/>';
    const SHUT = '<path d="M4.6 6 6 4.6 19.4 18 18 19.4ZM18 4.6 19.4 6 6 19.4 4.6 18Z"/>';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menumark';
    btn.setAttribute('aria-label', 'Menu');
    btn.setAttribute('aria-expanded', 'false');
    bar.id = bar.id || 'sections';
    btn.setAttribute('aria-controls', bar.id);
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + OPEN + '</svg>';
    corner.append(btn);

    // copyright goes at the bottom of the page, not in the dropdown
    const copy = bar.querySelector('.copy');
    if (copy) {
        const foot = document.createElement('p');
        foot.className = 'footcopy label';
        foot.textContent = copy.textContent;
        document.body.append(foot);
    }

    const set = open => {
        document.documentElement.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', String(open));
        btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
        btn.querySelector('svg').innerHTML = open ? SHUT : OPEN;
    };
    const isOpen = () => document.documentElement.classList.contains('menu-open');

    btn.addEventListener('click', () => set(!isOpen()));
    document.addEventListener('click', e => {
        if (isOpen() && !bar.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); } });
    bar.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    // close the menu if you hit back and the page comes back with it still open
    addEventListener('pageshow', () => set(false));
})();
