function navSlide() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-link');
  const navLinks = document.querySelectorAll('.nav-link li');
  console.log(navLinks);

  //Togl Nav
  burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    //Animate Links
    navLinks.forEach((link, i) => {
      if (link.style.animation) {
        link.style.animation = '';
      } else {
        link.style.animation = `navLinkFade 0.5s ease forwards ${i / 7 + 0.5}s`;
      }
    });

    burger.classList.toggle('toggle');
  });
}

w3.includeHTML(navSlide);
