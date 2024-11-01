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

  async function loadCases() {
    try {
        const response = await fetch('/api/casos');
        const cases = await response.json();
        const casesContainer = document.getElementById('cases-container');

        cases.forEach(caseItem => {
            const caseCard = document.createElement('div');
            caseCard.className = "mx-auto transition duration-300 max-w-xs rounded-lg overflow-hidden shadow-xl transform-gpu hover:scale-105 hover:bg-[#18beaa] hover:bg-opacity-50 hover:text-white flex flex-col mb-10";
            caseCard.innerHTML = `
                <div class="py-4 px-6 bg-transparent hover:bg-transparent transition duration-300 border border-[#18beaa] shadow-lg flex flex-col flex-grow">
                    <a href="#">
                        <h4 class="text-lg mb-3 font-extrabold text-[#18beaa] hover:text-white transition duration-300">
                            ${caseItem.nombre_caso}
                        </h4>
                    </a>
                    <p class="mb-3 text-xs text-gray-700 hover:text-white text-justify leading-relaxed transition duration-300 flex-grow">
                        ${caseItem.descripcion}
                    </p>
                    <div class="w-full h-40 mb-4 overflow-hidden rounded-lg shadow-md transition-transform transform hover:scale-105">
                        <img src="${caseItem.foto_url}" class="object-cover w-full h-full rounded-lg">
                    </div>
                    <div class="text-center mt-3">
                        <a href="{{ url_for('donation') }}"
                            class="inline-block px-4 py-2 text-white bg-[#18beaa] border border-[#139b89] rounded-md hover:bg-[#139b89] focus:outline-none focus:ring-2 focus:ring-[#18beaa] focus:ring-opacity-50 transition-transform transform-gpu hover:-translate-y-1 hover:shadow-xl">
                            Apoya a ${caseItem.nombre_caso}
                        </a>
                    </div>
                </div>
            `;
            casesContainer.appendChild(caseCard);
        });
    } catch (error) {
        console.error('Error fetching cases:', error);
    }
}

// Cargar casos cuando se carga la página
window.onload = loadCases;  