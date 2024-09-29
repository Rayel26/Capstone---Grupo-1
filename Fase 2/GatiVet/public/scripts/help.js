document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const slides = document.querySelector('.carousel-slide');
    let currentIndex = 0;
    const totalSlides = document.querySelectorAll('.carousel-slide > div').length;
  
    function updateSlide() {
      slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
  
    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
      updateSlide();
    });
  
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
      updateSlide();
    });
  
    // Optional: auto-slide
    setInterval(() => {
      nextButton.click();
    }, 3000); // Change slide every 5 seconds
  });