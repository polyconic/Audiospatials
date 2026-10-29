/* front page photo reel. 5s per artist, a slow dissolve between. hovering or focusing a name
   jumps to that artist and holds there. does nothing when the reel is hidden (phones) */
(function () {
    var reel = document.querySelector('.reel');
    if (!reel) return;
    var wide = matchMedia('(min-width: 1000px)');
    var slides = [].slice.call(reel.children);
    var i = 0, timer = null, held = false;

    function load(n) {
        var img = slides[n].querySelector('img');
        if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
        return img;
    }
    function show(n) {
        if (n === i) return;
        var img = load(n);
        var go = function () {
            slides[i].classList.remove('on');
            i = n;
            slides[i].classList.add('on');
            load((i + 1) % slides.length);
        };
        img.complete ? go() : img.addEventListener('load', go, { once: true });
    }
    function tick() {
        clearTimeout(timer);
        if (held || document.hidden || !wide.matches) return;
        timer = setTimeout(function () { show((i + 1) % slides.length); tick(); }, 5000);
    }

    [].forEach.call(document.querySelectorAll('.names a'), function (a) {
        var n = slides.findIndex(function (s) { return s.getAttribute('href') === a.getAttribute('href'); });
        var hold = function () { held = true; clearTimeout(timer); show(n); };
        var free = function () { held = false; tick(); };
        a.addEventListener('mouseenter', hold);
        a.addEventListener('focus', hold);
        a.addEventListener('mouseleave', free);
        a.addEventListener('blur', free);
    });
    document.addEventListener('visibilitychange', tick);
    wide.addEventListener('change', tick);
    wide.addEventListener('change', function () { if (wide.matches) { load(i); load((i + 1) % slides.length); } });
    if (wide.matches) { load(0); load(1 % slides.length); }
    tick();
})();
