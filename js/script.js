import { default as Slide, SlideNav } from "./slide.js";

const slide = new SlideNav('.slide', '.slide-wrapper');
slide.addArrow('.prev', '.next');
slide.addControl();