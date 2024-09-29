document.addEventListener("DOMContentLoaded", function () {
    const confirmModal = document.getElementById('confirmModal');
    const accountCreatedModal = document.getElementById('accountCreatedModal');
    
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    const closeModalButton = document.getElementById('closeModalButton');
    
    const createAccountButton = document.getElementById('createAccountButton');
    
    // Datos del formulario
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const secondLastNameInput = document.getElementById('secondLastName');
    const rutInput = document.getElementById('rut');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('c_password');
    const phoneInput = document.getElementById('phone');
    
    const summaryFirstName = document.getElementById('summaryFirstName');
    const summaryLastName = document.getElementById('summaryLastName');
    const summarySecondLastName = document.getElementById('summarySecondLastName');
    const summaryRUT = document.getElementById('summaryRUT');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');
    
    // Función para validar que todos los campos estén llenos
    function areFieldsFilled() {
        return firstNameInput.value && lastNameInput.value && secondLastNameInput.value &&
            rutInput.value && emailInput.value && passwordInput.value && confirmPasswordInput.value && phoneInput.value;
    }

    // Validar correo con arroba
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validar que la contraseña tenga al menos una mayúscula y un número
    function isValidPassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
        return passwordPattern.test(password);
    }

    // Validar RUT
    function isValidRut(rut) {
        const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
        return rutPattern.test(rut);
    }

    // Formatear RUT
    function formatRut() {
        let value = rutInput.value.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no válidos

        if (value.length > 8) {
            value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '-' + value.slice(8, 9); // Formatear
        } else if (value.length > 5) {
            value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5); // Formatear
        } else if (value.length > 2) {
            value = value.slice(0, 2) + '.' + value.slice(2); // Formatear
        }

        rutInput.value = value;
    }

    rutInput.addEventListener('input', formatRut);

    // Mostrar el modal de confirmación de datos
    createAccountButton.addEventListener('click', function () {
        if (!areFieldsFilled()) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        if (!isValidEmail(emailInput.value)) {
            alert('Por favor, ingresa un correo electrónico válido con un arroba (@).');
            return;
        }

        if (!isValidPassword(passwordInput.value)) {
            alert('La contraseña debe contener al menos una mayúscula y un número.');
            return;
        }

        if (!isValidRut(rutInput.value)) {
            alert('Por favor, ingresa un RUT válido.');
            return;
        }

        // Llenar los datos de resumen
        summaryFirstName.textContent = firstNameInput.value;
        summaryLastName.textContent = lastNameInput.value;
        summarySecondLastName.textContent = secondLastNameInput.value;
        summaryRUT.textContent = rutInput.value;
        summaryEmail.textContent = emailInput.value;
        summaryPhone.textContent = phoneInput.value; // Agregado para el teléfono
        
        confirmModal.classList.remove('hidden');
    });
    
    // Confirmar datos
    confirmButton.addEventListener('click', function () {
        confirmModal.classList.add('hidden');
        accountCreatedModal.classList.remove('hidden');
    });
    
    // Cancelar la confirmación de datos
    cancelButton.addEventListener('click', function () {
        confirmModal.classList.add('hidden');
    });
    
    // Cerrar el modal de cuenta creada
    closeModalButton.addEventListener('click', function () {
        accountCreatedModal.classList.add('hidden');
    });
});
