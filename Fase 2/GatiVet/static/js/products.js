document.getElementById('filterButton').addEventListener('click', function () {
    var filterMenu = document.getElementById('filterMenu');
    filterMenu.classList.toggle('hidden');
});

document.getElementById('addToCartBtn').addEventListener('click', function () {
    // Mostrar el modal
    document.getElementById('cartModal').classList.remove('hidden');
    document.getElementById('cartModal').classList.add('flex');

    // Incrementar el número en el icono del carrito
    let cartCountElement = document.getElementById('cartCount');
    let currentCount = parseInt(cartCountElement.textContent) || 0;
    cartCountElement.textContent = currentCount + 1;
});

document.getElementById('acceptModalBtn').addEventListener('click', function () {
    // Cerrar el modal
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});

// Manejador para el botón de cerrar el modal (X)
document.getElementById('closeModalBtn').addEventListener('click', function () {
    // Cerrar el modal
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});