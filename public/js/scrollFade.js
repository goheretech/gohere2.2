var heroText = document.querySelector('.creative');

function getPerct() {
    // Get percent scrolled
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    var scrolled =
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100; //0 to 100
    if (scrolled > 20) {
        heroText.style.opacity = 0;
    } else {
        heroText.style.opacity = 1;
    }
}
getPerct();

document.addEventListener('scroll', fadeHero);
function fadeHero() {
    getPerct();
}
