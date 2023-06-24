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

  // Muda a posição transform do slide
  moveSlide(num) {
    if (num === undefined) {
      this.slide.style.transform = `translateX(${this.captureX + (this.pointerX - this.oldClientX) * 1.6}px)`;
    } else {
      this.slide.style.transform = `translateX(${num}px)`;
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

  // Mouse/toque movido para fora ou finalizado.
  mouseUp(e) {
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


    window.addEventListener(moveType, this.mouseMove);

    const oldTranslateX = this.slide.style.transform;
    this.captureX = +oldTranslateX.match(this.regex).groups.number;
  }

  // Dados do slide.
  slideConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = -(element.offsetLeft - (window.innerWidth - element.clientWidth) / 2);
      return { element, position }
    });
    console.log(this.slideArray);
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index === 0 ? undefined : index - 1,
      active: index,
      next: index === last ? undefined : index + 1,
    }
    console.log(this.index);
  }

  // Muda para o slide de acordo com o index indicado.
  changeSlide(index) {
    this.mouseUp(); //

    this.moveSlide(this.slideArray[index].position);

    this.slideIndexNav(index);  
  }

  init() {
    this.slide.style.transform = 'translateX(0)';
    
    this.wrapper.addEventListener('mousedown', this.mouseIn);
    this.wrapper.addEventListener('touchstart', this.mouseIn);
    
    this.slideConfig();

    return this;
  }
}