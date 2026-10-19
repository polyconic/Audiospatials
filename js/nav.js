(function () {
    /* chrome preloads a page when you hover its link, so the fade lands on a
       loaded page. other browsers ignore this */
    if (window.HTMLScriptElement && HTMLScriptElement.supports &&
        HTMLScriptElement.supports('speculationrules')) {
        const rules = document.createElement('script');
        rules.type = 'speculationrules';
        rules.textContent = JSON.stringify({
            prerender: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }]
        });
        document.head.append(rules);
    }

    /* back arrow only goes back if you came from our own site, otherwise it
       just goes to the home page so nobody gets bounced off to google or wherever */
    const back = document.querySelector('.backmark');
    if (!back) return;

    back.addEventListener('click', function (e) {
        let internal = false;
        try {
            internal = !!document.referrer &&
                new URL(document.referrer).origin === location.origin;
        } catch (err) {}
        if (internal && history.length > 1) {
            e.preventDefault();
            history.back();
        }
    });
})();
