const navSlide = () => {
  console.log('active');
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.navlink');

  burger.addEventListener('click', () => {
    console.log('clicked');

    nav.classList.toggle('nav-active');
  });
};

console.log('sep1');
setTimeout(navSlide(), 50000);
