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
    let pricePerItem = 20; // Ejemplo de precio por item
    let subtotal = quantity * pricePerItem;
    let shipping = 10; // Costo de envío
    let tax = 5; // Importe de impuestos
    let total = subtotal + shipping + tax;

    // Actualizar los elementos de la interfaz
    document.getElementById('order-subtotal').textContent = `$${subtotal.toLocaleString('es-CL')}`;
    document.getElementById('shipping-cost').textContent = `$${shipping.toLocaleString('es-CL')}`;
    document.getElementById('tax-cost').textContent = `$${tax.toLocaleString('es-CL')}`;
    document.getElementById('order-total').textContent = `$${total.toLocaleString('es-CL')}`;
}

// Initialize the flatpickr for the expiration date input
flatpickr("#card-expiration-input", {
    dateFormat: "m/y",
    altInput: true,
    altFormat: "m/y",
    minDate: "today",
    enableTime: false,
    mode: "single",
    defaultDate: "01/24",
    locale: "es",
});

// Cart modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const payNowBtn = document.getElementById('payNowBtn');
    const cartModal = document.getElementById('cartModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const acceptModalBtn = document.getElementById('acceptModalBtn');

    payNowBtn.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', function() {
        cartModal.classList.add('hidden');
    });

    acceptModalBtn.addEventListener('click', function() {
        cartModal.classList.add('hidden');
    });

    const cartItemsContainer = document.getElementById('cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartItems(cart);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-white">El carrito está vacío.</p>';
        return;
    }

    cartItemsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('increment-btn')) {
            const productId = event.target.getAttribute('data-product-id');
            updateProductQuantity(productId, 1);
        }

        if (event.target.classList.contains('decrement-btn')) {
            const productId = event.target.getAttribute('data-product-id');
            updateProductQuantity(productId, -1);
        }
    });

    function renderCartItems(cart) {
        cartItemsContainer.innerHTML = '';
        let totalCartValue = 0;

        cart.forEach(product => {
            const totalPrice = product.cantidad * product.valor;
            totalCartValue += totalPrice;

            const imageUrl = product.imagen_url ? product.imagen_url : 'ruta/imagen/default.png';

            const cartItemHTML = `
            <div class="flex items-start gap-4">
                <div class="w-28 h-28 flex p-3 bg-gray-300 rounded-md">
                    <img src="${imageUrl}" class="w-full object-contain" onerror="this.onerror=null; this.src='ruta/imagen/default.png';" />
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

        document.getElementById('cart-total').textContent = totalCartValue.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
        document.getElementById('order-subtotal').textContent = totalCartValue.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

        // Call updateTotal to reflect the updated values
        updateTotal();
    }

    function updateProductQuantity(productId, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id_producto === parseInt(productId));

        if (productIndex !== -1) {
            cart[productIndex].cantidad += change;

            if (cart[productIndex].cantidad <= 0) {
                cart.splice(productIndex, 1);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems(cart);
        }
    }
});

// Function to update total
function updateTotal() {
    const subtotal = parseFloat(document.getElementById("order-subtotal").textContent.replace('$', '').replace('.', '').replace('.', '')) || 0;
    const shipping = parseFloat(document.getElementById("shipping-cost").textContent.replace('$', '').replace('.', '').replace('.', '')) || 0;
    const tax = parseFloat(document.getElementById("tax-cost").textContent.replace('$', '').replace('.', '').replace('.', '')) || 0;
    
    const total = subtotal + shipping + tax;
    document.getElementById("order-total").textContent = `$${total.toLocaleString('es-CL')}`;
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartTotal(); // Initial cart total update
});

function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, product) => sum + (product.cantidad * product.valor), 0);
    document.getElementById('cart-total').textContent = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}
