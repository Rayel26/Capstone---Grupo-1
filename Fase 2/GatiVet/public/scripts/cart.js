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