var heroText = document.querySelector('.creative');
var planet = document.querySelector('.planet');

function getPerct() {
    // Get percent scrolled
    var h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    var scrolled =
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100; //0 to 100
    var scrollInv = (scrolled)/100+1;
    var scrollInv2 = (100-scrolled)/100;
    if (planet) {planet.style.transform = `scale(${scrollInv}, ${scrollInv}) translateX(${scrolled*4}px)`;}
    if (heroText) {heroText.style.transform = `scale(${scrollInv2}, ${scrollInv2})`;}
    // console.log(scrollInv, planet.style.transform);
    
    if (scrolled > 25) {
        heroText.style.opacity = 0;
        if (planet) {planet.style.opacity = 0;}
    } else {
        heroText.style.opacity = 1;
        if (planet) {planet.style.opacity = 1;}
    }
}
getPerct();

document.addEventListener('scroll', fadeHero);
function fadeHero() {
    getPerct();
}
