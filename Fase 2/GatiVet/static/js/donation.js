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
const prefix = ""; // Si tienes un prefijo específico, cámbialo aquí.

if (phoneInput) {
    // Asegúrate de que el valor del celular se establece al cargar
    phoneInput.value = prefix + phoneInput.value.slice(prefix.length); // Se mantiene el valor original y el prefijo

    // Evento para restringir la entrada a solo los últimos 8 dígitos
    phoneInput.addEventListener('input', function() {
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

//Guarda datos en Supabase
document.getElementById("payNowBtn").addEventListener("click", async function(event) {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    // Capturar los valores del formulario
    const nameOption = document.getElementById("nameOption").value;
    const donationOption = document.getElementById("donationOption").value;

    // Asegurarse de que se hayan seleccionado los valores
    if (nameOption === "" || donationOption === "0") {
        alert("Por favor, selecciona un caso o fundación y un monto de donación.");
        return;
    }

    // Enviar datos a Flask a través de una petición AJAX
    try {
        const response = await fetch('/save_donation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Formulario tradicional
            },
            body: new URLSearchParams({
                nameOption: nameOption,
                donationOption: donationOption
            })
        });

        if (!response.ok) {
            throw new Error('Error al guardar la donación');
        }

        // Mostrar el modal de éxito
        document.getElementById("cartModal").classList.remove("hidden");
    } catch (error) {
        console.error("Error al registrar la donación:", error);
        alert("Hubo un error al procesar tu donación.");
    }
});

