// Función para cambiar la imagen principal
function changeImage(src) {
    document.getElementById("mainImage").src = src;
}

// Función para manejar el clic en "Añadir al carrito"
document.getElementById('addToCartBtn').addEventListener('click', function () {
    const product = {
        id_producto: "{{ product.id_producto }}",  // Obtenido del contexto de la plantilla
        nombre_producto: "{{ product.nombre_producto }}",
        valor: {{ product.valor }},
        marca: "{{ product.marca }}",
        imagen_url: "{{ product.imagen_url }}"
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
s