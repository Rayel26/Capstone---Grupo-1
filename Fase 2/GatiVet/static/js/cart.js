document.getElementById('increment-btn').addEventListener('click', function() {
    let quantityInput = document.getElementById('quantity-input');
    let quantity = parseInt(quantityInput.value);
    quantityInput.value = quantity + 1;

    // Update the total price
    updateTotalPrice();
});

document.getElementById('decrement-btn').addEventListener('click', function() {
    let quantityInput = document.getElementById('quantity-input');
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;

        // Update the total price
        updateTotalPrice();
    }
});

function updateTotalPrice() {
    let quantity = parseInt(document.getElementById('quantity-input').value);
    let pricePerItem = 20; // Example price per item
    let subtotal = quantity * pricePerItem;
    let shipping = 10; // Example shipping cost
    let tax = 5; // Example tax amount
    let total = subtotal + shipping + tax;

    document.getElementById('cart-total').textContent = `$${subtotal}`;
    document.getElementById('order-subtotal').textContent = `$${subtotal}`;
    document.getElementById('order-total').textContent = `$${total}`;
}

flatpickr("#card-expiration-input", {
    dateFormat: "m/y", // Format for user input
    altInput: true, // Use an alternate input for display
    altFormat: "m/y", // Format for the alternate input
    minDate: "today",
    enableTime: false,
    mode: "single",
    defaultDate: "01/24",
    locale: "es", // Apply Spanish locale
    onChange: function(selectedDates, dateStr, instance) {
        console.log(selectedDates, dateStr, instance);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const payNowBtn = document.getElementById('payNowBtn');
    const cartModal = document.getElementById('cartModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const acceptModalBtn = document.getElementById('acceptModalBtn');

    // Función para mostrar el modal
    payNowBtn.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
    });

    // Función para cerrar el modal
    closeModalBtn.addEventListener('click', function() {
        cartModal.classList.add('hidden');
    });

    // Función para aceptar y cerrar el modal
    acceptModalBtn.addEventListener('click', function() {
        cartModal.classList.add('hidden');
    });
});

///////////////Ver productos
document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');

    // Obtener los productos del carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-white">El carrito está vacío.</p>';
    } else {
        cart.forEach(product => {
            const totalPrice = product.cantidad * product.valor;

            const cartItemHTML = `
            <div class="flex items-start gap-4">
                <div class="w-28 h-28 flex p-3 bg-gray-300 rounded-md">
                    <img src='${product.imagen_url}' class="w-full object-contain" />
                </div>
                <div class="text-white flex flex-col justify-start">
                    <h3 class="text-lg font-semibold text-left">${product.nombre_producto}</h3>
                    <ul class="text-sm text-white mt-2">
                        <li class="flex items-center justify-between">
                            Cantidad 
                            <div class="flex items-center">
                                <button class="decrement-btn flex justify-center items-center w-8 h-8 rounded-l-md text-white bg-[#18beaa] hover:bg-[#16a597]" data-product-id="${product.id_producto}">
                                    -
                                </button>
                                <input type="text" class="w-12 text-center py-1 border-0 outline-none text-black" value="${product.cantidad}" readonly />
                                <button class="increment-btn flex justify-center items-center w-8 h-8 rounded-r-md text-white bg-[#18beaa] hover:bg-[#16a597]" data-product-id="${product.id_producto}">
                                    +
                                </button>
                            </div>
                        </li>
                        <li class="flex justify-between text-left">Precio Total <span>${totalPrice.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span></li>
                    </ul>
                </div>
            </div>
            `;

            cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }

    // Manejar incremento/decremento de cantidad
    document.querySelectorAll('.increment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateProductQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.decrement-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateProductQuantity(productId, -1);
        });
    });

    // Función para actualizar la cantidad de un producto en el carrito
    function updateProductQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id_producto === parseInt(productId));

        if (productIndex !== -1) {
            cart[productIndex].cantidad += change;

            // Eliminar el producto si la cantidad es 0
            if (cart[productIndex].cantidad <= 0) {
                cart.splice(productIndex, 1);
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Recargar la página para reflejar los cambios
            location.reload();
        }
    }
});

function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, product) => sum + (product.cantidad * product.valor), 0);
    document.getElementById('cart-total').textContent = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', updateCartTotal);
