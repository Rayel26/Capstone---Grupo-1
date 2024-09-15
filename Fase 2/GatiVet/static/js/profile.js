// Función para alternar entre edición y guardado
function toggleEditSaveProfile() {
    const isEditing = document.querySelector('#edit-save-button').textContent === 'Guardar';
    const emailInput = document.getElementById('email'); // Campo de correo
    const emailErrorMessage = document.getElementById('email-error-message'); // Mensaje de error de correo
    const phoneInput = document.getElementById('phone');
    const communeSelect = document.getElementById('commune'); 
    const editIcons = document.querySelectorAll('.edit-icon');
    const passwordInput = document.getElementById('password'); // Campo de contraseña
    const passwordErrorMessage = document.getElementById('password-error-message'); // Mensaje de error de contraseña

    if (isEditing) {
        // Verifica si el correo tiene un formato válido
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(emailInput.value)) {
            // Muestra el mensaje de error si el formato es incorrecto
            emailErrorMessage.classList.remove('hidden');
            return; // Detiene el guardado si hay un error
        } else {
            // Oculta el mensaje de error si el correo es válido
            emailErrorMessage.classList.add('hidden');
        }

        // Validar la contraseña
        const password = passwordInput.value;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);

        if (!hasUpperCase || !hasNumber) {
            passwordErrorMessage.classList.remove('hidden');
            return; // Detiene el guardado si la contraseña no es válida
        } else {
            passwordErrorMessage.classList.add('hidden');
        }

        // Guardar cambios y deshabilitar campos
        document.querySelectorAll('#profile-form input').forEach(input => {
            input.setAttribute('readonly', 'true');
            input.classList.add('bg-gray-50');
        });
        emailInput.setAttribute('readonly', 'true');
        emailInput.classList.add('bg-gray-50');
        communeSelect.setAttribute('disabled', 'true');
        editIcons.forEach(icon => {
            icon.classList.add('hidden');
        });
        document.querySelector('#edit-save-button').textContent = 'Editar';
        
        // Mostrar el modal de éxito
        showModal();
    } else {
        // Hacer editable el correo y otros campos
        document.querySelectorAll('#profile-form input').forEach(input => {
            input.removeAttribute('readonly');
            input.classList.remove('bg-gray-50');
            input.classList.add('bg-white');
        });
        emailInput.removeAttribute('readonly');
        emailInput.classList.remove('bg-gray-50');
        emailInput.classList.add('bg-white');
        communeSelect.removeAttribute('disabled');
        editIcons.forEach(icon => {
            icon.classList.remove('hidden');
        });
        document.querySelector('#edit-save-button').textContent = 'Guardar';
    }
}

// Función para mostrar el modal
function showModal() {
    document.getElementById('success-modal').classList.remove('hidden');
}

// Función para ocultar el modal
function hideModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// Event listener para el botón de cerrar el modal
document.querySelector('#success-modal button').addEventListener('click', () => {
    hideModal();
});

// Validar y formatear el campo de teléfono y RUT
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const phoneErrorMessage = document.getElementById('phone-error-message');
    const rutInput = document.getElementById('rut'); // RUT input
    const rutErrorMessage = document.getElementById('rut-error-message'); // RUT error message

    // Validar y formatear el campo de teléfono
    phoneInput.addEventListener('input', () => {
        // Verifica si el valor comienza con el prefijo +569
        if (!phoneInput.value.startsWith('+569 ')) {
            phoneInput.value.replace(/\D/g, '');
        }

        // Elimina cualquier carácter que no sea un número después del prefijo
        const numericPart = phoneInput.value.slice(5).replace(/\D/g, '');

        // Limita la longitud a 8 dígitos y actualiza el valor del input
        if (numericPart.length > 8) {
            phoneInput.value = '+569 ' + numericPart.slice(0, 8);
        } else {
            phoneInput.value = '+569 ' + numericPart;
        }

        // Muestra/oculta el mensaje de error basado en la longitud del número
        if (numericPart.length === 8) {
            phoneErrorMessage.classList.add('hidden');
        } else {
            phoneErrorMessage.classList.remove('hidden');
        }
    });

    // Validar el formato del RUT y formatear mientras se escribe
    rutInput.addEventListener('input', () => {
        rutInput.value = formatRut(rutInput.value); // Formateo automático
        if (!validateRut(rutInput.value)) {
            rutErrorMessage.classList.remove('hidden');
        } else {
            rutErrorMessage.classList.add('hidden');
        }
    });
});

// Función para validar el formato del RUT
function validateRut(rut) {
    const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/; // Permite dígitos o K/k al final
    return rutPattern.test(rut) && rut.replace(/\D/g, '').length === 9; // Incluye la longitud de 9 dígitos
}

// Función para formatear el RUT automáticamente mientras se escribe
function formatRut(value) {
    // Eliminar cualquier carácter que no sea un número o K/k
    value = value.replace(/[^0-9kK]/g, '');

    // Limitar a 9 caracteres (incluyendo puntos y guion)
    if (value.length > 9) {
        value = value.slice(0, 9);
    }

    // Aplicar el formato xx.xxx.xxx-x
    if (value.length > 1) {
        value = value.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + '-' + value.slice(-1);
    }
    return value;
}

//Función para formatear el teléfono automáticamente
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('phone');
    const phoneErrorMessage = document.getElementById('phone-error-message');

    // Función para validar el formato del teléfono
    function validatePhone(phone) {
        const phonePattern = /^\+569 \d{4} \d{4}$/;
        return phonePattern.test(phone);
    }

    // Función para formatear el teléfono automáticamente mientras se escribe
    function formatPhone(value) {
        // Eliminar cualquier carácter que no sea un número
        let numericValue = value.replace(/\D/g, '');

        // Limitar a 8 dígitos
        if (numericValue.length > 8) {
            numericValue = numericValue.slice(0, 8);
        }

        // Aplicar el formato +569 xxxx yyyy si hay dígitos
        let formattedValue = '+569 ';
        if (numericValue.length > 0) {
            if (numericValue.length > 4) {
                formattedValue += numericValue.slice(0, 4) + ' ' + numericValue.slice(4);
            } else {
                formattedValue += numericValue;
            }
        }

        return formattedValue;
    }

    phoneInput.addEventListener('input', () => {
        // Obtener el valor actual del input
        let rawValue = phoneInput.value;

        // Verificar si el prefijo +569 ya está en el valor
        if (rawValue.startsWith('+569 ')) {
            // Eliminar el prefijo para procesar solo los dígitos
            rawValue = rawValue.slice(5);
        }

        // Formatear el valor actual
        phoneInput.value = formatPhone(rawValue);

        // Validar el valor del input
        if (validatePhone(phoneInput.value)) {
            phoneErrorMessage.classList.add('hidden');
        } else {
            phoneErrorMessage.classList.remove('hidden');
        }
    });
});



// Mostrar la sección de perfil por defecto
showContent('profile');

// Toggle sidebar collapse on smaller screens
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

function showContent(sectionId) {
    // Ocultar todos los contenidos
    document.querySelectorAll('.step-content').forEach(div => {
        div.classList.add('hidden');
    });

    // Mostrar el contenido seleccionado
    document.getElementById(sectionId).classList.remove('hidden');

    // Resaltar el botón activo
    document.querySelectorAll('.step-sidebar button').forEach(btn => {
        btn.classList.remove('active-step');
        btn.querySelector('i').classList.remove('active-step');
        btn.querySelector('span').classList.remove('active-step');
    });

    const activeButton = document.querySelector(`button[onclick="showContent('${sectionId}')"]`);
    activeButton.classList.add('active-step');
    activeButton.querySelector('i').classList.add('active-step');
    activeButton.querySelector('span').classList.add('active-step');
}

////////////////////////////////////////////////////////////////
//Mascotas

document.getElementById('pet-select').addEventListener('change', function() {
    var select = this;
    var selectedOption = select.options[select.selectedIndex];
    
    var name = selectedOption.getAttribute('data-name');
    var age = selectedOption.getAttribute('data-age');
    var species = selectedOption.getAttribute('data-species');
    var breed = selectedOption.getAttribute('data-breed');
    var birthdate = selectedOption.getAttribute('data-birthdate');  // Obteniendo la fecha de nacimiento
    
    var petName = document.getElementById('pet-name');
    var petAge = document.getElementById('pet-age');
    var petSpecies = document.getElementById('pet-species');
    var petBreed = document.getElementById('pet-breed');
    var petBirthdate = document.getElementById('pet-birthdate');  // Campo para la fecha de nacimiento
    var editButton = document.getElementById('edit-button');
    
    if (name) {
        petName.value = name;
        petAge.value = age;
        petSpecies.value = species;
        petBreed.value = breed;
        petBirthdate.value = birthdate;  // Mostrar la fecha de nacimiento
        editButton.disabled = false;
    } else {
        petName.value = 'Selecciona una mascota';
        petAge.value = '';
        petSpecies.value = '';
        petBreed.value = '';
        petBirthdate.value = '';  // Limpiar la fecha de nacimiento si no se selecciona ninguna mascota
        editButton.disabled = true;
    }
});

// Selección de la imagen y vista previa
document.getElementById('edit-photo-button').addEventListener('click', function() {
    document.getElementById('pet-photo').click();
});

document.getElementById('pet-photo').addEventListener('change', function(e) {
    const preview = document.getElementById('photo-preview');
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = function () {
        preview.src = reader.result;
        preview.classList.remove('hidden');
    };
    
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
        preview.classList.add('hidden');
    }
});

