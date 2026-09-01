document.querySelectorAll('.js-current-year').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
});

document.querySelectorAll('.product-carousel').forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll('.product-slide'));
    const previousButton = carousel.querySelector('[data-carousel-previous]');
    const nextButton = carousel.querySelector('[data-carousel-next]');
    const currentCounter = carousel.querySelector('[data-carousel-current]');
    const totalCounter = carousel.querySelector('[data-carousel-total]');
    let currentIndex = 0;

    if (!slides.length || !previousButton || !nextButton || !currentCounter || !totalCounter) {
        return;
    }

    const formatCounter = (value) => String(value).padStart(2, '0');
    const updateCarousel = () => {
        slides.forEach((slide, index) => {
            const isActive = index === currentIndex;
            slide.hidden = !isActive;
            slide.setAttribute('aria-hidden', String(!isActive));
            slide.setAttribute('aria-label', `Product ${index + 1} of ${slides.length}`);
        });

        currentCounter.textContent = formatCounter(currentIndex + 1);
        totalCounter.textContent = formatCounter(slides.length);
        const hasMultipleSlides = slides.length > 1;
        previousButton.disabled = !hasMultipleSlides;
        nextButton.disabled = !hasMultipleSlides;
    };

    previousButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    carousel.addEventListener('keydown', (event) => {
        if (slides.length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            return;
        }

        event.preventDefault();
        currentIndex = event.key === 'ArrowLeft'
            ? (currentIndex - 1 + slides.length) % slides.length
            : (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    updateCarousel();
});
