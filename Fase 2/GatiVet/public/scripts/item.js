// Función para cambiar la imagen principal
function changeImage(src) {
    document.getElementById("mainImage").src = src;
}

// Función para manejar el clic en "Add to Cart"
document.getElementById('addToCartBtn').addEventListener('click', function () {
    // Mostrar el modal
    document.getElementById('cartModal').classList.remove('hidden');
    document.getElementById('cartModal').classList.add('flex');

    // Obtener el conteo del carrito
    let cartCountElement = document.getElementById('cartCount');
    let quantityElement = document.getElementById('quantity');
    let currentCount = parseInt(cartCountElement.textContent) || 0;
    let quantity = parseInt(quantityElement.value) || 1;

    // Incrementar el conteo con la cantidad seleccionada
    let newCount = currentCount + quantity;
    cartCountElement.textContent = newCount;

    // Guardar el nuevo conteo en localStorage
    localStorage.setItem('cartCount', newCount);

    // Opcional: Actualizar el nombre del artículo en el modal
    const itemName = 'Premium Wireless Headphones'; // Actualiza esto si es necesario
    document.getElementById('modalItemName').textContent = itemName;
});

// Función para manejar el cierre del modal
document.getElementById('closeModalBtn').addEventListener('click', function () {
    // Cerrar el modal
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});

// Inicializar el conteo del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Recuperar el conteo del carrito desde localStorage
    let cartCountElement = document.getElementById('cartCount');
    let storedCount = localStorage.getItem('cartCount');
    
    if (storedCount) {
        cartCountElement.textContent = storedCount; // Establecer el conteo en el elemento
    } else {
        cartCountElement.textContent = 0; // Si no hay conteo, establecer en 0
    }
});