export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);

    this.mouseIn = this.mouseIn.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);

    this.regex = /(?:(?<number>-?\d+)(?:px)?)/;

    this.slideConfig();
    this.init();
  }

  // Muda a posição transform do slide
  moveSlide(num) {
    if (num === undefined) {
      this.slide.style.transform = `translateX(${this.captureX + (this.pointerX - this.oldClientX) * 1.6}px)`;
    } else {
      this.slide.style.transform = `translateX(${num}px)`;
    }
  }

  // Mouse/toque executado.
  mouseIn(e) {
    let moveType;
    if (e.type === 'mousedown') {
      e.preventDefault();
      this.oldClientX = e.clientX;
      this.wrapper.addEventListener('mouseup', this.mouseUp);
      moveType = 'mousemove';
    } else {
      this.oldClientX = e.changedTouches[0].clientX;
      this.wrapper.addEventListener('touchend', this.mouseUp);
      moveType = 'touchmove';
    }

    window.addEventListener(moveType, this.mouseMove);

    const oldTranslateX = this.slide.style.transform;
    this.captureX = +oldTranslateX.match(this.regex).groups.number;

    this.transition(false);
  }

  // Mouse/toque movido para fora ou finalizado.
  mouseUp(e) {
    window.removeEventListener('mousemove', this.mouseMove);
    this.wrapper.removeEventListener('mouseup', this.mouseUp);
    
    window.removeEventListener('touchmove', this.mouseMove);
    this.wrapper.removeEventListener('touchend', this.mouseUp);

    if (e !== undefined) {
      if (e.type === 'mouseup') {
        this.changeSlideMouseUp(this.oldClientX - e.clientX);
      } else {
        this.changeSlideMouseUp(this.oldClientX - e.changedTouches[0].clientX);
      }
    }

    this.transition(true);
  }

  transition(state) {
    this.slide.style.transition = state ? 'transform .3s' : '';
  }

  changeSlideMouseUp(value) {
    if(value > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if(value < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  // Movimento do mouse/toque
  mouseMove(e) {
    if (!this.wrapper.contains(e.target)) {
      this.mouseUp();
    }

    this.pointerX = (e.type === 'mousemove') ? e.clientX : e.changedTouches[0].clientX;
    
    this.moveSlide();
  }

  // Dados do slide.
  slideConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = -(element.offsetLeft - (window.innerWidth - element.clientWidth) / 2);
      return { element, position }
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index === 0 ? undefined : index - 1,
      active: index,
      next: index === last ? undefined : index + 1,
    }
  }

  // Muda para o slide de acordo com o index indicado.
  changeSlide(index) {
    this.mouseUp();

    this.moveSlide(this.slideArray[index].position);

    this.slideIndexNav(index);  
  }

  activeNextSlide() {
    if(this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    }
  }

  activePrevSlide() {
    if(this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    }
  }

  init() {
    this.slide.style.transform = 'translateX(0)';
    
    this.wrapper.addEventListener('mousedown', this.mouseIn);
    this.wrapper.addEventListener('touchstart', this.mouseIn);
    
    this.changeSlide(0);
    this.transition(true);

    return this;
  }
}