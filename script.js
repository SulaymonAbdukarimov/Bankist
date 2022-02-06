document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('.modal');
  const closeModalBtn = document.querySelector('.btn--close-modal');
  const overlay = document.querySelector('.overlay');
  const openModalBtn = document.querySelectorAll('.btn--show-modal');
  const scrollToBtn = document.querySelector('.btn--scroll-to');
  const section1 = document.querySelector('#section--1');
  const navLinks = document.querySelector('.nav__links');
  const navLink = document.querySelectorAll('.nav__link');
  const tabsContainer = document.querySelector('.operations__tab-container');
  const tabs = document.querySelectorAll('.operations__tab');
  const tabsContent = document.querySelectorAll('.operations__content');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const images = document.querySelectorAll('img[data-src]');
  const sliderWrapper = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const sliderLeftBtn = document.querySelector('.slider__btn--left');
  const sliderRightBtn = document.querySelector('.slider__btn--right');
  const sliderDots = document.querySelector('.dots');
  let current = 0;
  let maxSlide = slides.length;

  // MODAL
  function closeModal() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openModal() {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimer);
  }

  openModalBtn.forEach(btn => {
    btn.addEventListener('click', event => {
      event.preventDefault();
      openModal();
    });
  });

  closeModalBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.querySelector('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  const modalTimer = setInterval(openModal, 5000);
  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll);
    }
  }
  window.addEventListener('scroll', showModalByScroll);

  //LEARN  MORE BTN
  scrollToBtn.addEventListener('click', () => {
    section1.scrollIntoView({ behavior: 'smooth' });
  });

  // SCROLL SMOOTH OF NAV
  navLinks.addEventListener('click', event => {
    event.preventDefault();
    if (event.target.classList.contains('nav__link')) {
      const id = event.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

  // TABS
  tabsContainer.addEventListener('click', e => {
    const clicked = e.target.closest('.operations__tab');
    if (!clicked) return;

    tabs.forEach(tab => {
      tab.classList.remove('operations__tab--active');
    });

    tabsContent.forEach(content => {
      content.classList.remove('operations__content--active');
    });

    clicked.classList.add('operations__tab--active');

    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  });

  // MENU FADE ANIMATION
  function fadeAnimationNav(e) {
    if (e.target.classList.contains('nav__link')) {
      let target = e.target;
      console.log(target);
      let link = target.closest('.nav').querySelectorAll('.nav__link');
      let img = target.closest('.nav').querySelector('img');
      link.forEach(i => {
        if (i !== target) {
          i.style.opacity = this;
        }
      });
      img.style.opacity = this;
    }
  }
  nav.addEventListener('mouseover', fadeAnimationNav.bind(0.5));
  nav.addEventListener('mouseout', fadeAnimationNav.bind(1));

  // STICKY NAVBAR
  let navHeight = nav.getBoundingClientRect().height; //90px
  function stickyNavbar(entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else {
      nav.classList.remove('sticky');
    }
  }
  const headerObserver = new IntersectionObserver(stickyNavbar, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });
  headerObserver.observe(header);
  // LAZY LOADING IMAGE

  function imageLoad(entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', e => {
      e.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  }
  const imageObserver = new IntersectionObserver(imageLoad, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });

  // SLIDERS
  function slider() {
    const createDots = function () {
      slides.forEach(function (_, i) {
        sliderDots.insertAdjacentHTML(
          'beforeend',
          `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };
    createDots();

    function activateDot(slide) {
      document.querySelectorAll('.dots__dot').forEach(dot => {
        dot.classList.remove('dots__dot--active');
      });

      document
        .querySelector(`.dots__dot[data-slide="${slide}"]`)
        .classList.add('dots__dot--active');
    }
    activateDot(0);

    function movementOfSlide(l) {
      //l = offset
      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${100 * (index - l)}%)`;
        console.log(index);
      });
    }

    function next() {
      if (current === maxSlide - 1) {
        current = 0;
      } else {
        current++;
      }
      activateDot(current);
      movementOfSlide(current);
    }
    next();

    function prev() {
      if (current === 0) {
        current = maxSlide - 1;
      } else {
        current--;
      }
      activateDot(current);
      movementOfSlide(current);
    }
    prev();
    function init() {
      activateDot(0);
      movementOfSlide(0);
    }
    init();
    sliderLeftBtn.addEventListener('click', prev);
    sliderRightBtn.addEventListener('click', next);

    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'ArrowRight') {
        next();
      }
    });

    sliderDots.addEventListener('click', function (e) {
      if (e.target.classList.contains('dots__dot')) {
        const { slide } = e.target.dataset;
        movementOfSlide(slide);
        activateDot(slide);
      }
    });
  }
  slider();
});
