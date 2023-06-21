export default class Slide {
  constructor(slide, wrapper) {
    console.log(this);
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.mouseIn = this.mouseIn.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    this.regex = /(?:(?<number>-?\d+)(?:px)?)/;

    this.init();
  }

  mouseMove(e) {
    // console.log(e.currentTarget);
    // console.log(this.captureX);
    // console.log(this.captureX + (e.clientX - this.oldClientX));

    if (!this.wrapper.contains(e.target)) {
      this.mouseUp();
    }

    this.slide.style.transform = `translateX(${this.captureX + (e.clientX - this.oldClientX)}px)`;
  }

  mouseUp(e) {
    console.log('up');
    window.removeEventListener('mousemove', this.mouseMove);
    this.wrapper.removeEventListener('mouseup', this.mouseUp);
    this.wrapper.removeEventListener('mouseout', this.mouseOut, false);
  }

  mouseIn(e) {
    e.preventDefault();
    this.wrapper.addEventListener('mouseup', this.mouseUp);

    console.log('down');
    this.oldClientX = e.clientX;

    window.addEventListener('mousemove', this.mouseMove);

    const oldTranslateX = this.slide.style.transform;
    this.captureX = +oldTranslateX.match(this.regex).groups.number;
  }

  init() {
    console.log(this.slide);
    this.wrapper.addEventListener('mousedown', this.mouseIn);

    this.slide.style.transform = 'translateX(0)';
  }
}