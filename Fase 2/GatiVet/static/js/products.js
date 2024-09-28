//////////////////MODAL
// Seleccionar elementos relevantes
const cartModal = document.getElementById('cartModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const acceptModalBtn = document.getElementById('acceptModalBtn');
const addToCartBtns = document.querySelectorAll('.addToCartBtn');

// Función para abrir el modal
const openModal = () => {
    cartModal.classList.remove('hidden');
};

// Función para cerrar el modal
const closeModal = () => {
    cartModal.classList.add('hidden');
};
//////////////////Fin MODAL

// Asignar evento a cada botón "Agregar al carrito"
addToCartBtns.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();  // Evitar el comportamiento predeterminado
        openModal();  // Abrir el modal cuando se hace clic
    });
});

// Asignar evento para cerrar el modal al hacer clic en el botón de cerrar o aceptar
closeModalBtn.addEventListener('click', closeModal);
acceptModalBtn.addEventListener('click', closeModal);


// Manejador botones filtros y ordenar por
document.getElementById('sortMenuButton').addEventListener('click', function () {
  const sortMenu = document.getElementById('sortMenu');
  sortMenu.classList.toggle('hidden');
});

document.getElementById('filtersMenuButton').addEventListener('click', function () {
  const filtersMenu = document.getElementById('filtersMenu');
  filtersMenu.classList.toggle('hidden');
});

//////////////////contador numerito carrito
    // Inicializa el contador del carrito
    document.addEventListener('DOMContentLoaded', () => {
      // Inicializa el contador del carrito
      let cartCount = 0;

      // Selecciona todos los botones de agregar al carrito
      const addToCartBtns = document.querySelectorAll('.addToCartBtn');

      // Función para actualizar el contador del carrito
      function updateCartCount() {
          const cartCountElement = document.getElementById('cartCount');
          cartCountElement.textContent = cartCount; // Actualiza el texto del contador
      }

      // Agrega evento a cada botón de agregar al carrito
      addToCartBtns.forEach(button => {
          button.addEventListener('click', () => {
              cartCount++; // Incrementa el contador
              updateCartCount(); // Actualiza el contador visual
              button.textContent = 'Agregado'; // Cambia el texto del botón
              button.disabled = true; // Desactiva el botón para evitar múltiples clics
          });
      });
  });