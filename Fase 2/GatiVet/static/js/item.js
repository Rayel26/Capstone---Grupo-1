// Función para cambiar la imagen principal
function changeImage(src) {
    document.getElementById("mainImage").src = src;
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = cart.findIndex(item => item.id_producto === product.id_producto);

    if (existingProductIndex !== -1) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        cart[existingProductIndex].cantidad += 1;
    } else {
        // Si no está en el carrito, agregarlo con una cantidad inicial de 1
        product.cantidad = 1;
        cart.push(product);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Mostrar una alerta o mensaje que confirme la acción
    alert("Producto agregado al carrito");
}


// Función para manejar el clic en "Añadir al carrito"
document.getElementById('addToCartBtn').addEventListener('click', function () {
    // Obtener los datos del producto del botón usando los atributos data-*
    const product = {
        id_producto: this.getAttribute('data-id-producto'),
        nombre_producto: this.getAttribute('data-nombre-producto'),
        valor: parseFloat(this.getAttribute('data-valor')),  // Convertir a número
        marca: this.getAttribute('data-marca'),
        imagen_url: this.getAttribute('data-imagen-url')
    };

    // Llamar a la función para agregar el producto al carrito
    addToCart(product);

    // Mostrar el modal de confirmación
    document.getElementById('cartModal').classList.remove('hidden');
    document.getElementById('cartModal').classList.add('flex');
});

// Función para manejar el cierre del modal
document.getElementById('closeModalBtn').addEventListener('click', function () {
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});
