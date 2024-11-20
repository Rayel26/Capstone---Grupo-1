document.getElementById('phone').addEventListener('input', function(event) {
    let input = event.target.value;

    // Eliminar caracteres que no sean números, excepto el '+'
    input = input.replace(/[^+\d]/g, '');

    // Asegúrate de que el número comience con +569
    if (!input.startsWith('+569')) {
        // Si no comienza con +569, reinicia el input
        input = input.replace(/\D/g, ''); // Eliminar caracteres no numéricos
        if (input.length > 8) {
            input = input.slice(0, 8); // Limitar a 8 dígitos
        }
        input = '+569 ' + input; // Añadir +569 al inicio
    } else {
        // Solo mantener los 8 dígitos después del +569
        input = input.slice(4).replace(/\D/g, ''); // Quitar +569 y caracteres no numéricos
        if (input.length > 8) {
            input = input.slice(0, 8); // Limitar a 8 dígitos
        }
        input = '+569 ' + input; // Reagregar +569
    }

    // Formatear en bloques de 4 dígitos
    const match = input.match(/(\+569\s)(\d{0,4})(\d{0,4})/);
    if (match) {
        input = match[1] + (match[2] ? match[2] + ' ' : '') + match[3];
    }

    // Actualizar el valor del input
    event.target.value = input.trim();
});

// Tu código existente
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

    payNowBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Evita que el formulario se envíe inmediatamente
        let isValid = true;

        // Validar que el carrito no esté vacío
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        // Limpiar mensajes de error anteriores
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.add('hidden'));

        // Validar campos de información personal
        const nameInput = document.getElementById('name');
        const lastnameInput = document.getElementById('lastname');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (!nameInput.value.trim()) {
            showError(nameInput, 'name-error-message');
            isValid = false;
        }

        if (!lastnameInput.value.trim()) {
            showError(lastnameInput, 'lastname-error-message');
            isValid = false;
        }

        if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'email-error-message');
            isValid = false;
        }
        
        // Validar campos de método de pago
        const cardNumberInput = document.getElementById('card-number-input');
        const expirationInput = document.getElementById('card-expiration-input');
        const cvvInput = document.getElementById('cvv-input');

        if (!cardNumberInput.value.trim() || cardNumberInput.value.length !== 16) {
            showError(cardNumberInput, 'card-number-error-message');
            isValid = false;
        }

        if (!expirationInput.value.trim()) {
            showError(expirationInput, 'expiration-error-message');
            isValid = false;
        }

        if (!cvvInput.value.trim() || cvvInput.value.length !== 3) {
            showError(cvvInput, 'cvv-error-message');
            isValid = false;
        }

        if (isValid) {
            // Preparar los datos para enviar
            const orderData = cart.map(item => ({
                id_producto: item.id_producto,
                cantidad: item.cantidad
            }));
        
            // Hacer la solicitud al backend para actualizar el stock
            Promise.all(orderData.map(item => {
                return fetch(`/update_stock/${item.id_producto}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ quantity: item.cantidad })
                })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(data => {
                            throw new Error(`Error al actualizar stock para producto ${item.id_producto}: ${data.message || response.statusText}`);
                        });
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.success) {
                        throw new Error(`Error al actualizar stock para producto ${item.id_producto}: ${data.message}`);
                    }
                });
            }))
            .then(() => {
                // Refrescar los campos del método de pago
                document.getElementById('card-number-input').value = "";
                document.getElementById('card-expiration-input').value = "";
                document.getElementById('cvv-input').value = "";

                localStorage.removeItem('cart');
                renderCartItems([]); // Actualizar la UI con el carrito vacío

            })
            .catch(error => {
                console.error("Error al procesar el stock:", error);
                alert(`Ocurrió un error al actualizar el stock: ${error.message}`);
            });
        }        
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

document.addEventListener('DOMContentLoaded', function() {
    updateCartTotal(); // Initial cart total update
});

function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, product) => sum + (product.cantidad * product.valor), 0);
    document.getElementById('cart-total').textContent = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
}

const updateStock = async (productId, quantity) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/update_stock/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity }), // Asegúrate de que esto se esté enviando correctamente
        });
        
        if (!response.ok) {
            throw new Error(`Error al actualizar stock para producto ${productId}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error(error);
    }
};

function showError(input, errorMessageId) {
    document.getElementById(errorMessageId).classList.remove('hidden');
    input.classList.add('border-red-500'); // Resalta el borde del input
    input.focus(); // Enfoca el input que tiene el error
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Botón de pagar ahora
const payNowBtn = document.getElementById('payNowBtn');
const cartModal = document.getElementById('cartModal');
const loadingSpinner = document.getElementById('loading-spinner');

// Escucha el evento de clic en el botón "Pagar ahora"
payNowBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe inmediatamente
    let isValid = true;
    console.log("Botón 'Pagar ahora' clickeado");

    // Validar que el carrito no esté vacío
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    console.log("Carrito no está vacío:", cart);

    // (Puedes incluir aquí otras validaciones si es necesario...)

    if (isValid) {
        // Mostrar el spinner antes de la solicitud
        loadingSpinner.classList.remove('hidden');

        // Preparar los datos para enviar
        const orderData = cart.map(item => ({
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            nombre_producto: item.nombre_producto, // Agregamos el nombre del producto
            precio: item.valor // Asegúrate de que "valor" es el precio
        }));

        // Hacer la solicitud al backend para guardar la venta
        fetch('/save_sale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cart: orderData })
        })
        .then(response => response.json())
        .then(data => {
            // Ocultar el spinner después de la respuesta
            loadingSpinner.classList.add('hidden');
            
            if (data.success) {
                // Mostrar el modal en lugar de una alerta
                cartModal.classList.remove('hidden'); // Mostrar el modal
                localStorage.removeItem('cart');
                renderCartItems([]); // Actualizar la UI con el carrito vacío
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            // Ocultar el spinner si hay un error
            loadingSpinner.classList.add('hidden');
            console.error("Error al guardar la venta:", error);
            alert(`Ocurrió un error al guardar la venta: ${error.message}`);
        });
    }
});


// Función para renderizar los ítems del carrito
function renderCartItems(cart) {
    const cartContainer = document.getElementById('cart-items'); // Asegúrate de tener un contenedor con este ID
    cartContainer.innerHTML = ''; // Limpiar el contenido actual

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    // Si hay elementos en el carrito, renderízalos
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.nombre_producto} - ${item.cantidad} x $${item.precio}</p>
        `;
        cartContainer.appendChild(itemElement);
    });
}