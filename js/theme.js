/* light from 9am to 5pm on the visitor's own clock, dark the rest of the time (css/theme.css).
   loaded in the head before anything draws, so a page never flashes the wrong one. checks again
   every minute so it flips for someone still on the site at 9 or 5.
   the button in the corner flips it by hand, and that choice is kept (localStorage) over the clock.
   also the loading screen: once per visit, until the page has loaded (at least 0.7s, at most 3s) */
(function () {
    var html = document.documentElement, KEY = 'as-theme';
    function chosen() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
    function setTheme() {
        var h = new Date().getHours(), pick = chosen();
        var light = pick ? pick === 'light' : h >= 9 && h < 17;
        html.setAttribute('data-theme', light ? 'light' : 'dark');
        var m = document.querySelector('meta[name="theme-color"]');
        if (m) m.setAttribute('content', light ? '#fbfbfb' : '#0a0a0a');
    }
    setTheme();
    setInterval(setTheme, 60000);

    // the toggle, first in the corner beside the mail mark. a circle, half filled
    document.addEventListener('DOMContentLoaded', function () {
        var corner = document.querySelector('.corner');
        if (!corner) return;
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'thememark';
        b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2.5a7.5 7.5 0 0 0 0 15Z"/></svg>';
        function label() {
            b.setAttribute('aria-label', html.getAttribute('data-theme') === 'light' ? 'Dark mode' : 'Light mode');
        }
        b.addEventListener('click', function () {
            var next = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            try { localStorage.setItem(KEY, next); } catch (e) {}
            setTheme();
            label();
        });
        label();
        corner.insertBefore(b, corner.firstChild);
    });

    var seen = false;
    try { seen = !!sessionStorage.getItem('as-loaded'); sessionStorage.setItem('as-loaded', '1'); } catch (e) {}
    if (seen || document.prerendering) return;
    html.classList.add('loading');
    var start = Date.now(), finished = false;
    function done() {
        if (finished) return;
        finished = true;
        setTimeout(function () {
            html.classList.add('loaded');
            setTimeout(function () { html.classList.remove('loading', 'loaded'); }, 800);
        }, Math.max(0, 700 - (Date.now() - start)));
    }
    addEventListener('load', done);
    setTimeout(done, 3000);
})();
