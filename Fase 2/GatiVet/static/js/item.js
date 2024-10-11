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
    cartCountElement.textContent = currentCount + quantity;

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
    // Establecer el conteo en 0
    let cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = 0;
    }
});

