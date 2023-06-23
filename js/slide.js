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

  // Movimento do mouse/toque
  mouseMove(e) {
    if (!this.wrapper.contains(e.target)) {
      this.mouseUp();
    }

    const pointerX = (e.type === 'mousemove') ? e.clientX : e.changedTouches[0].clientX;

    this.slide.style.transform = `translateX(${this.captureX + (pointerX - this.oldClientX) * 1.6}px)`;
  }

  // Mouse/toque movido para fora ou finalizado.
  mouseUp(e) {
    console.log('up');

    window.removeEventListener('mousemove', this.mouseMove);
    this.wrapper.removeEventListener('mouseup', this.mouseUp);
    
    window.removeEventListener('touchmove', this.mouseMove);
    this.wrapper.removeEventListener('touchend', this.mouseUp);
  }

  // Mouse/toque executado.
  mouseIn(e) {
    let moveType
    if (e.type === 'mousedown') {
      e.preventDefault();
      this.oldClientX = e.clientX;
      this.wrapper.addEventListener('mouseup', this.mouseUp);
      moveType = 'mousemove'
    } else {
      this.oldClientX = e.changedTouches[0].clientX;
      this.wrapper.addEventListener('touchend', this.mouseUp);
      moveType = 'touchmove'
    }

    console.log('down');
    console.log(this.oldClientX);

    window.addEventListener(moveType, this.mouseMove);

    const oldTranslateX = this.slide.style.transform;
    this.captureX = +oldTranslateX.match(this.regex).groups.number;
  }

  init() {
    this.slide.style.transform = 'translateX(0)';

    this.wrapper.addEventListener('mousedown', this.mouseIn);
    this.wrapper.addEventListener('touchstart', this.mouseIn);
  }
}