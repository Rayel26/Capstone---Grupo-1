document.addEventListener('DOMContentLoaded', () => {
    const modalToggleButtons = document.querySelectorAll('[data-modal-toggle]');
    const modals = document.querySelectorAll('.modal');

    modalToggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetModal = document.querySelector(button.getAttribute('data-modal-target'));
            targetModal.classList.remove('hidden');
        });
    });

    document.querySelectorAll('[data-modal-hide]').forEach(button => {
        button.addEventListener('click', () => {
            const targetModal = document.querySelector(button.getAttribute('data-modal-hide'));
            targetModal.classList.add('hidden');
        });
    });

    // Add event listener for the "Sí, enviar" button to open the success modal and close the confirm modal
    document.querySelector('[data-success-modal]').addEventListener('click', () => {
        const confirmModal = document.querySelector('#confirm-modal');
        const successModal = document.querySelector('#success-modal');
        confirmModal.classList.add('hidden');
        successModal.classList.remove('hidden');
    });
});