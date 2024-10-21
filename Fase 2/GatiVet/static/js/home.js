//Modales home
//Modal ver más consulta general
function openModal() {
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
//Fin modal ver más home

//Modal ver mas vacunación
function openVaccinationModal() {
  document.getElementById("vaccination-modal").classList.remove("hidden");
}

function closeVaccinationModal() {
  document.getElementById("vaccination-modal").classList.add("hidden");
}
//Fin modal ver mas vacunación

//Modal ver mas toma de muestra
function openSampleModal() {
  document.getElementById("sample-modal").classList.remove("hidden");
}

function closeSampleModal() {
  document.getElementById("sample-modal").classList.add("hidden");
}

//Fin modal ver mas toma de muestra

//Modal ver mas especialidad
function openFelineModal() {
  document.getElementById("feline-modal").classList.remove("hidden");
}

function closeFelineModal() {
  document.getElementById("feline-modal").classList.add("hidden");
}
//Fin modal ver mas especialidad

//Fin modales home

//Ver comentarios

async function fetchComentarios() {
  const response = await fetch('/comentarios');
  if (!response.ok) {
      console.error("Error al obtener comentarios:", response.statusText);
      return [];
  }
  const comentarios = await response.json();
  return comentarios;
}

// Inicializar el slider
let slider;

async function renderComentarios() {
  const comentarios = await fetchComentarios();
  const contenedorComentarios = document.getElementById('keen-slider');
  contenedorComentarios.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos comentarios

  comentarios.forEach(comentario => {
    const slide = document.createElement('div');
    slide.className = 'keen-slider__slide';

    // Genera los íconos de estrellas según la calificación
    const estrellas = Array.from({ length: 5 }, (_, i) => `
        <svg class="w-4 h-4 ${i < comentario.calificacion ? 'text-green-500' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    `).join('');

    slide.innerHTML = `
        <blockquote class="flex h-full flex-col justify-between bg-white p-3 shadow-sm max-w-xs rounded-lg">
            <div>
                <div class="flex gap-0.5">
                    ${estrellas}  <!-- Aquí se insertan las estrellas -->
                </div>

                <div class="mt-2">
                    <p class="text-lg font-bold text-rose-600 sm:text-xl">${comentario.titulo}</p>
                    <p class="mt-2 leading-relaxed text-gray-700 text-sm">${comentario.texto}</p>
                </div>
                <footer class="mt-4 text-sm font-medium text-gray-700 sm:mt-4">
                    &mdash; ${comentario.Usuario.nombre} ${comentario.Usuario.appaterno}
                </footer>
            </div>
        </blockquote>
    `;

    contenedorComentarios.appendChild(slide);
  });

  // Reinicializa el slider con los nuevos slides
  if (slider) {
    slider.destroy(); // Destruir el slider anterior
  }

  // Inicializa el slider para mostrar 5 comentarios al mismo tiempo
  slider = new KeenSlider("#keen-slider", {
    loop: true,
    slides: {
      origin: 'center',
      perView: 1.25,
      spacing: 16,
    },
    breakpoints: {
      '(min-width: 1024px)': {
        slides: {
          origin: 'center',
          perView: 4,
          spacing: 32,
        },
      },
    },
  });

  // Botones de navegación
  document.getElementById("keen-slider-previous").addEventListener("click", () => {
    slider.prev();
  });

  document.getElementById("keen-slider-next").addEventListener("click", () => {
    slider.next();
  });
}

// Llama a la función para renderizar comentarios al cargar la página
renderComentarios();