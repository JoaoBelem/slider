import Slide from './slide.js';

const slide = new Slide('.slide', '.slide-wrapper');

slide.changeSlide(0);

setTimeout(() => {
  // slide.changeSlide(5);
  slide.activePrevSlide();
}, 1000);
