document.addEventListener("DOMContentLoaded", function () {
    // Elementos del DOM
    const confirmModal = document.getElementById('confirmModal');
    const accountCreatedModal = document.getElementById('accountCreatedModal');
    
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');
    const closeModalButton = document.getElementById('closeModalButton');
    const createAccountButton = document.getElementById('createAccountButton');
    
    const registrationForm = document.getElementById('registrationForm');

    // Datos del formulario
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const secondLastNameInput = document.getElementById('secondLastName');
    const rutInput = document.getElementById('rut');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const phoneInput = document.getElementById('phone');
    
    const summaryFirstName = document.getElementById('summaryFirstName');
    const summaryLastName = document.getElementById('summaryLastName');
    const summarySecondLastName = document.getElementById('summarySecondLastName');
    const summaryRUT = document.getElementById('summaryRUT');
    const summaryEmail = document.getElementById('summaryEmail');
    const summaryPhone = document.getElementById('summaryPhone');

    // Configuración de Supabase
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM'
    const endpoint = 'https://wlnahmbigsbckwbdwezo.supabase.co/rest/v1/Usuario';

    // Validación de campos
    function areFieldsFilled() {
        return firstNameInput.value && lastNameInput.value && secondLastNameInput.value &&
            rutInput.value && emailInput.value && passwordInput.value && phoneInput.value;
    }

    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function isValidPassword(password) {
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d).+$/;
        return passwordPattern.test(password);
    }

    function isValidRut(rut) {
        const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
        return rutPattern.test(rut);
    }

    // Formateo y validación de teléfono
    function validatePhone(input) {
        input.value = input.value.replace(/[^0-9]/g, '').slice(0, 8); // Limitar a 8 números
    }

    phoneInput.addEventListener('input', function() {
        validatePhone(this);
    });

    function getFullPhone() {
        return '+569' + phoneInput.value;
    }

    // Formateo de RUT
    function formatRut() {
        let value = rutInput.value.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no válidos
        if (value.length > 8) {
            value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '-' + value.slice(8, 9);
        } else if (value.length > 5) {
            value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5);
        } else if (value.length > 2) {
            value = value.slice(0, 2) + '.' + value.slice(2);
        }
        rutInput.value = value;
    }

    rutInput.addEventListener('input', formatRut);

    // Funciones para mostrar y ocultar modales
    function showModal(modal) {
        modal.classList.remove('hidden');
    }

    function hideModal(modal) {
        modal.classList.add('hidden');
    }

    // Función para verificar si el correo ya existe
    function checkEmailExists(email) {
        return fetch(`${endpoint}?correo=eq.${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al consultar la base de datos.');
            }
            return response.json();
        })
        .then(data => {
            return data.length > 0; // Si hay resultados, el correo ya existe
        })
        .catch(error => {
            console.error('Error al consultar la base de datos:', error);
            throw error;
        });
    }

    // Crear cuenta
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

        // Verificar si el correo ya existe
        checkEmailExists(emailInput.value).then(emailExists => {
            if (emailExists) {
                alert('Este correo ya está registrado.');
            } else {
                // Llenar el resumen
                summaryFirstName.textContent = firstNameInput.value;
                summaryLastName.textContent = lastNameInput.value;
                summarySecondLastName.textContent = secondLastNameInput.value;
                summaryRUT.textContent = rutInput.value;
                summaryEmail.textContent = emailInput.value;
                summaryPhone.textContent = getFullPhone();

                showModal(confirmModal); // Mostrar modal de confirmación
            }
        }).catch(error => {
            alert('Error al verificar el correo: ' + error.message);
        });
    });

    // Confirmar y enviar datos a Supabase
    confirmButton.addEventListener('click', function () {
        const userData = {
            nombre: firstNameInput.value,
            appaterno: lastNameInput.value,
            apmaterno: secondLastNameInput.value,
            id_usuario: rutInput.value.replace(/[^0-9kK]/g, ''), // Eliminar caracteres no válidos
            correo: emailInput.value,
            contraseña: passwordInput.value,
            celular: getFullPhone(),
            tipousuarioid: 1
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
            if (response.ok) {
                hideModal(confirmModal); // Ocultar modal de confirmación
                showModal(accountCreatedModal); // Mostrar modal de cuenta creada
                registrationForm.reset(); // Limpiar formulario
            } else {
                return response.json().then(data => {
                    throw new Error(data.message || 'Error al crear la cuenta.');
                });
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    });

    // Cerrar el modal de "Cuenta creada"
    closeModalButton.addEventListener('click', function () {
        hideModal(accountCreatedModal); // Cerrar modal de cuenta creada
    });

    // Cancelar y cerrar el modal de confirmación
    cancelButton.addEventListener('click', function () {
        hideModal(confirmModal);
    });
});
