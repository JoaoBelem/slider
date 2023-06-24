import Slide from './slide.js';

const slide = new Slide('.slide', '.slide-wrapper');

slide.changeSlide(3);

setTimeout(() => {
  slide.changeSlide(5);
}, 2000);

console.log('a');