// Carrito

// Función para agregar el producto al carrito
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Asegúrate de que id_producto sea un número
    const existingProductIndex = cart.findIndex(item => item.id_producto === Number(product.id_producto));

    if (existingProductIndex !== -1) {
        // Incrementar cantidad por la cantidad ingresada
        cart[existingProductIndex].cantidad += product.cantidad; // Sumar la cantidad ingresada
    } else {
        // Añadir producto con la cantidad ingresada
        cart.push(product);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar el contador y el total de productos
    updateCartCount(); // Actualiza el número de productos en el carrito
    updateCartTotal(); // Actualiza el total en el carrito

    // Mostrar modal de éxito
    showCartModal(product.nombre_producto, product.cantidad);
}

// Función para mostrar el modal de carrito
function showCartModal(productName, quantity) {

    document.getElementById('cartModal').classList.remove('hidden');
}

// Cerrar el modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('cartModal').classList.add('hidden');
});

// Asignar el evento al botón "Agregar al carrito"
document.getElementById('addToCartBtn').addEventListener('click', function() {
    const productId = this.getAttribute('data-id-producto');

    // Obtener el valor de cantidad del input
    const quantityInput = document.getElementById('quantity');
    const quantity = parseInt(quantityInput.value) || 1; // Asegurarse de que sea un número

    const product = {
        id_producto: parseInt(productId),
        nombre_producto: this.getAttribute('data-nombre-producto'),
        valor: parseFloat(this.getAttribute('data-valor')),
        marca: this.getAttribute('data-marca'),
        imagen_url: this.getAttribute('data-imagen-url'),
        cantidad: quantity // Usar la cantidad del input
    };

    addToCart(product);
});
