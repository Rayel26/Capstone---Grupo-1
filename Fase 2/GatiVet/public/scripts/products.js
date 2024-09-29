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


// Manejador de los menús "Ordenar por" y "Filtros"
document.getElementById('sortMenuButton').addEventListener('click', function () {
    const sortMenu = document.getElementById('sortMenu');
    sortMenu.classList.toggle('hidden');  // Mostrar/ocultar el menú de ordenar
});

document.getElementById('filtersMenuButton').addEventListener('click', function () {
    const filtersMenu = document.getElementById('filtersMenu');
    filtersMenu.classList.toggle('hidden');  // Mostrar/ocultar el menú de filtros
});

// Aplicar filtros
document.getElementById('applyFiltersButton').addEventListener('click', function () {
    // Aquí puedes agregar la lógica para aplicar los filtros seleccionados
    alert('Filtros aplicados');
});


//////////////////contador numerito carrito
// Inicializa el contador del carrito
document.addEventListener('DOMContentLoaded', () => {
    // Recupera el conteo del carrito desde localStorage
    let cartCountElement = document.getElementById('cartCount');
    let storedCount = localStorage.getItem('cartCount');
    
    if (storedCount) {
        cartCountElement.textContent = storedCount; // Establecer el conteo en el elemento
    } else {
        cartCountElement.textContent = 0; // Si no hay conteo, establecer en 0
    }

    // Asignar evento a cada botón "Agregar al carrito"
    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            let currentCount = parseInt(cartCountElement.textContent) || 0;
            currentCount++; // Incrementa el contador
            cartCountElement.textContent = currentCount; // Actualiza el texto del contador

            // Guardar el nuevo conteo en localStorage
            localStorage.setItem('cartCount', currentCount); 
        });
    });
});
