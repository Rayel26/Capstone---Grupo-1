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
    const passwordInput = document.getElementById('password'); // Solo se mantiene este
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
            rutInput.value && emailInput.value && passwordInput.value && phoneInput.value;
    }

        // Lógica de los modales
        function showModal(modal) {
            modal.classList.remove('hidden');
        }
    
        function hideModal(modal) {
            modal.classList.add('hidden');
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

    // Función para validar teléfono
    function validatePhone(input) {
        // Reemplazar caracteres no numéricos
        input.value = input.value.replace(/[^0-9]/g, '');

        // Limitar la longitud a 8 números
        if (input.value.length > 8) {
            input.value = input.value.slice(0, 8);
        }
    }

    phoneInput.addEventListener('input', function() {
        validatePhone(this);
    });

    function getFullPhone() {
        return '+569' + phoneInput.value; // Retorna el número completo con el prefijo
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


    // Definir el endpoint para la tabla Usuario
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM';
    // Inicializar el cliente de Supabase
    const endpoint = 'https://wlnahmbigsbckwbdwezo.supabase.co/rest/v1/Usuario';

createAccountButton.addEventListener('click', function (event) {
    event.preventDefault(); // Previene el envío del formulario por defecto

    // Validación de campos
    if (!areFieldsFilled()) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    if (!isValidEmail(emailInput.value)) {
        alert('Por favor, ingresa un correo electrónico válido.');
        return;
    }

    if (!isValidPassword(passwordInput.value)) {
        alert('La contraseña debe contener al menos una letra mayúscula y un número.');
        return;
    }

    if (!isValidRut(rutInput.value)) {
        alert('Por favor, ingresa un RUT válido.');
        return;
    }

     // Mostrar el modal de confirmación
    createAccountButton.addEventListener('click', function (event) {
        event.preventDefault(); // Previene el envío del formulario por defecto

        // Validación de campos
        if (!areFieldsFilled()) {
            alert('Todos los campos son obligatorios.');
            return;
        }
    // Mostrar el modal de confirmación de datos
    summaryFirstName.textContent = firstNameInput.value;
    summaryLastName.textContent = lastNameInput.value;
    summarySecondLastName.textContent = secondLastNameInput.value;
    summaryRUT.textContent = rutInput.value;
    summaryEmail.textContent = emailInput.value;
    summaryPhone.textContent = getFullPhone();

    showModal(confirmModal); // Mostrar el modal de confirmación

    // Confirmar datos y hacer el fetch
    confirmButton.addEventListener('click', function () {
        const userData = {
            nombre: firstNameInput.value,
            appaterno: lastNameInput.value,
            apmaterno: secondLastNameInput.value,
            id_usuario: rutInput.value.replace(/[^0-9kK]/g, ''), // Eliminar caracteres no válidos
            correo: emailInput.value,
            contraseña: passwordInput.value,
            celular: getFullPhone()
        };

        // Verificar longitud del RUT
        if (userData.id_usuario.length > 9) {
            alert('El RUT no puede exceder los 9 caracteres.');
            return; // Salir si el RUT es demasiado largo
        }

        // Hacer la solicitud fetch
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.status === 204) {
                return null;
            }
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error al crear la cuenta.');
                });
            }
            return response.text().then(text => {
                if (text) {
                    return JSON.parse(text);
                }
                return null;
            });
        })
        .then(data => {
            if (data) {
                hideModal(confirmModal); // Ocultar el modal de confirmación
                showModal(accountCreatedModal); // Mostrar modal de cuenta creada
                registrationForm.reset(); // Limpiar el formulario
            } else {
                console.log("No se devolvieron datos.");
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
            console.error('Error:', error);
        });
    });

    // Cerrar modales
    cancelButton.addEventListener('click', function () {
        hideModal(confirmModal); // Cerrar el modal de confirmación
    });

    closeModalButton.addEventListener('click', function () {
        hideModal(accountCreatedModal); // Cerrar el modal de cuenta creada
    });
});
    
});

});

