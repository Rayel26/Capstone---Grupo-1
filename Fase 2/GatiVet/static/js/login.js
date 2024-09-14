document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('forgot-password-link').addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('forgot-password-modal').classList.remove('hidden');
    });

    document.getElementById('close-modal').addEventListener('click', function() {
        document.getElementById('forgot-password-modal').classList.add('hidden');
    });

    document.getElementById('submit-email').addEventListener('click', function(event) {
        event.preventDefault();
        // Oculta el primer modal
        document.getElementById('forgot-password-modal').classList.add('hidden');
        // Muestra el segundo modal
        document.getElementById('confirmation-modal').classList.remove('hidden');
    });

    document.getElementById('close-confirmation-modal').addEventListener('click', function() {
        document.getElementById('confirmation-modal').classList.add('hidden');
    });
});