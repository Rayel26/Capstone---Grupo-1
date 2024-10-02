// Actualizar cantidad y precio (si los botones de incremento o decremento existen)
const incrementBtn = document.getElementById('increment-btn');
const decrementBtn = document.getElementById('decrement-btn');
const quantityInput = document.getElementById('quantity-input');

if (incrementBtn) {
    incrementBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        quantityInput.value = quantity + 1;
        updateTotalPrice();
    });
}

if (decrementBtn) {
    decrementBtn.addEventListener('click', function() {
        let quantity = parseInt(quantityInput.value);
        if (quantity > 1) {
            quantityInput.value = quantity - 1;
            updateTotalPrice();
        }
    });
}

function updateTotalPrice() {
    let quantity = parseInt(quantityInput.value);
    let pricePerItem = 20; // Precio por ítem (ejemplo)
    let subtotal = quantity * pricePerItem;
    let shipping = 10; // Costo de envío (ejemplo)
    let tax = 5; // Impuestos (ejemplo)
    let total = subtotal + shipping + tax;

    // Verifica si los elementos de precio existen antes de actualizarlos
    const cartTotalElem = document.getElementById('cart-total');
    const orderSubtotalElem = document.getElementById('order-subtotal');
    const orderTotalElem = document.getElementById('order-total');

    if (cartTotalElem) cartTotalElem.textContent = `$${subtotal}`;
    if (orderSubtotalElem) orderSubtotalElem.textContent = `$${subtotal}`;
    if (orderTotalElem) orderTotalElem.textContent = `$${total}`;
}

// Configuración de flatpickr para el campo de fecha de expiración de tarjeta (si existe)
const cardExpirationInput = document.getElementById('card-expiration-input');
if (cardExpirationInput) {
    flatpickr(cardExpirationInput, {
        dateFormat: "m/y",
        altInput: true,
        altFormat: "m/y",
        minDate: "today",
        enableTime: false,
        mode: "single",
        defaultDate: "01/24",
        locale: "es",
        onChange: function(selectedDates, dateStr, instance) {
            console.log(selectedDates, dateStr, instance);
        }
    });
}

// Modal funcionalidad (si existe)
const payNowBtn = document.getElementById('payNowBtn');
const cartModal = document.getElementById('cartModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const acceptModalBtn = document.getElementById('acceptModalBtn');

if (payNowBtn && cartModal) {
    payNowBtn.addEventListener('click', function() {
        cartModal.classList.remove('hidden');
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            cartModal.classList.add('hidden');
        });
    }

    if (acceptModalBtn) {
        acceptModalBtn.addEventListener('click', function() {
            cartModal.classList.add('hidden');
        });
    }
}

// Función para manejar la entrada de los últimos 8 dígitos y mantener el prefijo fijo
const phoneInput = document.getElementById('phone-input');
const prefix = "+56 9 "; // Prefijo fijo

if (phoneInput) {
    // Establecemos el prefijo al cargar la página
    phoneInput.value = prefix;

    // Evento para restringir la entrada a solo los últimos 8 dígitos
    phoneInput.addEventListener('input', function() {
        // Capturamos solo los números después del prefijo
        let userInput = phoneInput.value.slice(prefix.length).replace(/\D/g, '');

        // Limitamos a 8 dígitos
        if (userInput.length > 8) {
            userInput = userInput.slice(0, 8);
        }

        // Actualizamos el valor del input con el prefijo y los últimos 8 dígitos
        phoneInput.value = prefix + userInput;
    });

    // Evitamos que el usuario elimine el prefijo
    phoneInput.addEventListener('keydown', function(e) {
        if (phoneInput.selectionStart < prefix.length && (e.key === 'Backspace' || e.key === 'Delete')) {
            e.preventDefault();
        }
    });

    // Mantenemos el cursor siempre después del prefijo
    phoneInput.addEventListener('click', function() {
        if (phoneInput.selectionStart < prefix.length) {
            phoneInput.setSelectionRange(prefix.length, prefix.length);
        }
    });
}
