/* Release covers: a 1200px copy from img/releases/sm/ for grids, the full
   file for big screens. A cover with no small copy yet just uses the full one,
   so adding a release only needs the one file. */
function coverImg(img, file, small) {
    const full = '/img/releases/' + file;
    const sm = '/img/releases/sm/' + file;
    img.onerror = () => { img.onerror = null; img.removeAttribute('srcset'); img.src = full; };
    if (small) { img.src = sm; return; }
    img.srcset = sm + ' 1200w, ' + full + ' 3000w';
    img.sizes = '(max-width: 480px) 100vw, (max-width: 1000px) 50vw, 33vw';
    img.src = sm;
}
