/*
export default function decorate(block) {
  const slides = [...block.children];

  // Add classes to each slide and slide text
  slides.forEach((slide) => {
    slide.classList.add('slide');
    const cols = [...slide.children];
    if (cols.length > 1) {
      cols[1].classList.add('slide-text');
    }
  });

  // Wrap slides in a container for sliding effect
  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('slides-wrapper');
  slides.forEach((slide) => slidesWrapper.appendChild(slide));

  // Clear original block and re-append structured content
  block.innerHTML = '';
  block.appendChild(slidesWrapper);

  // Create navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'btn btn-prev';
  prevBtn.innerText = '<';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn-next';
  nextBtn.innerText = '>';

  block.appendChild(prevBtn);
  block.appendChild(nextBtn);

  // Set initial position of each slide
  const allSlides = block.querySelectorAll('.slide');
  allSlides.forEach((slide, i) => {
    slide.style.transform = `translateX(${i * 100}%)`;
  });

  let currentSlide = 0;
  const maxSlide = allSlides.length - 1;

  const moveToSlide = (index) => {
    allSlides.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - index)}%)`;
    });
  };

  // Button click handlers
  nextBtn.addEventListener('click', () => {
    currentSlide = currentSlide === maxSlide ? 0 : currentSlide + 1;
    moveToSlide(currentSlide);
  });

  prevBtn.addEventListener('click', () => {
    currentSlide = currentSlide === 0 ? maxSlide : currentSlide - 1;
    moveToSlide(currentSlide);
  });
}
*/
