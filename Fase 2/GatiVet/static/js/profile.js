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
// Mascotas
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos del formulario
    const petSelect = document.getElementById('pet-select');
    const petName = document.getElementById('pet-name');
    const petAge = document.getElementById('pet-age');
    const petSpecies = document.getElementById('pet-species');
    const petBreed = document.getElementById('pet-breed');
    const petBirthdate = document.getElementById('pet-birthdate');
    const editButton = document.getElementById('edit-button');
    const addPetIcon = document.getElementById('add-pet-icon');
    const closeModal = document.getElementById('close-modal');
    const addPetForm = document.getElementById('add-pet-form');
    const addPetModal = document.getElementById('add-pet-modal');
    const editPetModal = document.getElementById('edit-pet-modal');
    const closeEditModal = document.getElementById('close-edit-modal');
    const editPetForm = document.getElementById('edit-pet-form');
    const editPetName = document.getElementById('edit-pet-name');
    const editPetAge = document.getElementById('edit-pet-age');
    const editPetSpecies = document.getElementById('edit-pet-species');
    const editPetBreedDog = document.getElementById('edit-pet-breed-dog');
    const editPetBreedCat = document.getElementById('edit-pet-breed-cat');
    const editPetBirthdate = document.getElementById('edit-pet-birthdate');
    const editPhotoButton = document.getElementById('edit-photo-button');
    const petPhoto = document.getElementById('pet-photo');
    const photoPreview = document.getElementById('photo-preview');
    const newPetSpecies = document.getElementById('new-pet-species');
    const newPetBreedDog = document.getElementById('new-pet-breed-dog');
    const newPetBreedCat = document.getElementById('new-pet-breed-cat');

    if (!petSelect || !petName || !petAge || !petSpecies || !petBreed || !petBirthdate || !editButton ||
        !addPetIcon || !closeModal || !addPetForm || !addPetModal || !editPetModal || !closeEditModal ||
        !editPetForm || !editPetName || !editPetAge || !editPetSpecies || !editPetBreedDog || !editPetBreedCat ||
        !editPetBirthdate || !editPhotoButton || !petPhoto || !photoPreview || !newPetSpecies || !newPetBreedDog || !newPetBreedCat) {
        console.error('Uno o más elementos necesarios no se encontraron en el DOM.');
        return;
    }

    // Mostrar detalles de la mascota seleccionada
    petSelect.addEventListener('change', function() {
        const select = this;
        const selectedOption = select.options[select.selectedIndex];
        
        const name = selectedOption.getAttribute('data-name');
        const age = selectedOption.getAttribute('data-age');
        const species = selectedOption.getAttribute('data-species');
        const breed = selectedOption.getAttribute('data-breed');
        const birthdate = selectedOption.getAttribute('data-birthdate');
        
        if (name) {
            petName.value = name;
            petAge.value = age;
            petSpecies.value = species;
            petBreed.value = breed;
            petBirthdate.value = birthdate;
            editButton.disabled = false;
        } else {
            petName.value = 'Selecciona una mascota';
            petAge.value = '';
            petSpecies.value = '';
            petBreed.value = '';
            petBirthdate.value = '';
            editButton.disabled = true;
        }
    });

    // Abre el modal para agregar una nueva mascota
    addPetIcon.addEventListener('click', function() {
        addPetModal.classList.remove('hidden');
    });

    // Cierra el modal al hacer clic en el botón "Cancelar"
    closeModal.addEventListener('click', function() {
        addPetModal.classList.add('hidden');
    });

    // Maneja el envío del formulario del modal para agregar una nueva mascota
    addPetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario
        const name = document.getElementById('new-pet-name').value;
        const age = document.getElementById('new-pet-age').value;
        const species = document.getElementById('new-pet-species').value;

        // Seleccionar la raza correcta dependiendo de la especie
        let breed;
        if (species === 'perro') {
            breed = newPetBreedDog.value;
        } else if (species === 'gato') {
            breed = newPetBreedCat.value;
        } else {
            breed = ''; // En caso de otra especie
        }

        const birthdate = document.getElementById('new-pet-birthdate').value;
        
        // Crear una nueva opción en el select
        const select = petSelect;
        const newOption = document.createElement('option');
        newOption.value = name.toLowerCase().replace(/\s+/g, '_'); // Genera un valor único para la opción
        newOption.textContent = name;
        newOption.setAttribute('data-name', name);
        newOption.setAttribute('data-age', age);
        newOption.setAttribute('data-species', species);
        newOption.setAttribute('data-breed', breed);
        newOption.setAttribute('data-birthdate', birthdate);
        
        // Agregar la nueva opción al final del <select>
        select.appendChild(newOption);
        select.value = newOption.value; // Seleccionar la nueva mascota automáticamente

        // Limpiar el formulario y ocultar el modal
        addPetForm.reset();
        addPetModal.classList.add('hidden');
        
        // Actualizar campos de detalles de la mascota
        petName.value = name;
        petAge.value = age;
        petSpecies.value = species;
        petBreed.value = breed;
        petBirthdate.value = birthdate;

        // Habilitar el botón de editar
        editButton.disabled = false;
    });

    // Abre el modal para editar la mascota
    editButton.addEventListener('click', function() {
        const selectedOption = petSelect.options[petSelect.selectedIndex];
        const name = selectedOption.getAttribute('data-name');
        const age = selectedOption.getAttribute('data-age');
        const species = selectedOption.getAttribute('data-species');
        const breed = selectedOption.getAttribute('data-breed');
        const birthdate = selectedOption.getAttribute('data-birthdate');

        if (name) {
            // Rellenar el formulario de edición con los datos de la mascota seleccionada
            editPetName.value = name;
            editPetAge.value = age;
            editPetSpecies.value = species;
            editPetSpecies.disabled = false; // Hacer el campo de especie editable para pruebas
            editPetBreedDog.value = species === 'perro' ? breed : '';
            editPetBreedCat.value = species === 'gato' ? breed : '';
            editPetBirthdate.value = birthdate;

            // Mostrar el modal
            editPetModal.classList.remove('hidden');
        } else {
            console.error('No hay una mascota seleccionada para editar.');
        }
    });

    // Cierra el modal de edición
    closeEditModal.addEventListener('click', function() {
        editPetModal.classList.add('hidden');
    });

    // Maneja el envío del formulario del modal de edición
    editPetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario de edición
        const name = editPetName.value;
        const age = editPetAge.value;
        const species = editPetSpecies.value;

        // Seleccionar la raza correcta dependiendo de la especie
        let breed;
        if (species === 'perro') {
            breed = editPetBreedDog.value;
        } else if (species === 'gato') {
            breed = editPetBreedCat.value;
        } else {
            breed = ''; // En caso de otra especie
        }

        const birthdate = editPetBirthdate.value;
        
        // Actualizar la opción en el <select> correspondiente
        const select = petSelect;
        const selectedOption = select.options[select.selectedIndex];
        selectedOption.setAttribute('data-name', name);
        selectedOption.setAttribute('data-age', age);
        selectedOption.setAttribute('data-species', species);
        selectedOption.setAttribute('data-breed', breed);
        selectedOption.setAttribute('data-birthdate', birthdate);

        // Actualizar los valores visibles en el select
        selectedOption.textContent = name;

        // Limpiar el formulario y ocultar el modal
        editPetForm.reset();
        editPetModal.classList.add('hidden');
        
        // Actualizar campos de detalles de la mascota
        petName.value = name;
        petAge.value = age;
        petSpecies.value = species;
        petBreed.value = breed;
        petBirthdate.value = birthdate;

        // Habilitar el botón de editar
        editButton.disabled = false;
    });

    // Maneja la carga de foto
    editPhotoButton.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                petPhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Función para actualizar las razas en función de la especie seleccionada en el formulario de edición
    editPetSpecies.addEventListener('change', function() {
        const species = editPetSpecies.value;

        if (species === 'perro') {
            editPetBreedDog.parentElement.style.display = 'block';
            editPetBreedCat.parentElement.style.display = 'none';
        } else if (species === 'gato') {
            editPetBreedDog.parentElement.style.display = 'none';
            editPetBreedCat.parentElement.style.display = 'block';
        } else {
            editPetBreedDog.parentElement.style.display = 'none';
            editPetBreedCat.parentElement.style.display = 'none';
        }
    });

    // Función para actualizar las razas en función de la especie seleccionada en el formulario de agregar mascota
    newPetSpecies.addEventListener('change', function() {
        const species = newPetSpecies.value;

        if (species === 'perro') {
            newPetBreedDog.parentElement.style.display = 'block';
            newPetBreedCat.parentElement.style.display = 'none';
        } else if (species === 'gato') {
            newPetBreedDog.parentElement.style.display = 'none';
            newPetBreedCat.parentElement.style.display = 'block';
        } else {
            newPetBreedDog.parentElement.style.display = 'none';
            newPetBreedCat.parentElement.style.display = 'none';
        }
    });
});

////////////////////////////////////////////////////////////////
//carnet digital
function showTab(tabId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.tab-content').forEach(function(tab) {
        tab.classList.add('hidden');
    });
    // Mostrar la sección seleccionada
    document.getElementById(tabId).classList.remove('hidden');
}
const descriptions = {
    'descripcion1': 'Revisión completa de salud. Chequeo de peso, temperatura y estado general. Se verificó la condición física general, se realizaron pruebas de diagnóstico para detectar posibles problemas y se ofrecieron recomendaciones para el cuidado continuo. Este control es fundamental para asegurar que la mascota se mantenga en óptimas condiciones de salud a lo largo del tiempo.',
    'descripcion2': 'Limpieza dental y revisión de encías. Se realizó una limpieza exhaustiva de los dientes y se examinaron las encías para detectar signos de enfermedades dentales. El veterinario también proporcionó consejos sobre cómo mantener una buena higiene dental en el hogar. La salud dental es crucial para prevenir problemas futuros y mantener la boca de la mascota en buen estado.'
};

function openModal(descriptionKey) {
    document.getElementById('modal-description').textContent = descriptions[descriptionKey];
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

//carnet digital
function showTab(tabId) {
    // Oculta todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    // Muestra la pestaña seleccionada
    document.getElementById(tabId).classList.remove('hidden');

    // Estilo para pestañas activas
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.querySelector(`button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Efecto hover para filas de la tabla
document.querySelectorAll('table tbody tr').forEach(row => {
    row.addEventListener('mouseover', () => {
        row.style.backgroundColor = '#f0f0f0'; // Color de fondo al pasar el ratón
    });
    row.addEventListener('mouseout', () => {
        row.style.backgroundColor = ''; // Restaurar el color de fondo original
    });
});

// Función para mostrar el modal con la descripción completa
function openModal(descriptionId) {
    const descriptions = {
        'descripcion1': 'Revisión completa de salud. Chequeo de peso, temperatura y estado general. Se verificó la condición física general, se realizaron pruebas de diagnóstico para detectar posibles problemas y se ofrecieron recomendaciones para el cuidado continuo. Este control es fundamental para asegurar que la mascota se mantenga en óptimas condiciones de salud a lo largo del tiempo.',
        'descripcion2': 'Limpieza dental y revisión de encías. Se realizó una limpieza exhaustiva de los dientes y se examinaron las encías para detectar signos de enfermedades dentales. El veterinario también proporcionó consejos sobre cómo mantener una buena higiene dental en el hogar. La salud dental es crucial para prevenir problemas futuros y mantener la boca de la mascota en buen estado.'
        // Agrega más descripciones según sea necesario
    };
    
    document.getElementById('modal-description').textContent = descriptions[descriptionId];
    document.getElementById('modal').classList.remove('hidden');
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Configuración de paginación
const rowsPerPage = 5;
let currentPage = 1;

function paginateTable(tableId, rowsPerPage) {
    const table = document.querySelector(`#${tableId} table`);
    const rows = table.querySelectorAll('tbody tr');
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    function showPage(page) {
        rows.forEach((row, index) => {
            row.style.display = (index >= (page - 1) * rowsPerPage && index < page * rowsPerPage) ? '' : 'none';
        });
    }

    function createPaginationControls() {
        const pagination = document.querySelector(`#${tableId}-pagination`);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-button');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updatePaginationControls();
            });
            pagination.appendChild(button);
        }
    }

    function updatePaginationControls() {
        const buttons = document.querySelectorAll(`#${tableId}-pagination .pagination-button`);
        buttons.forEach(button => button.classList.remove('active'));
        buttons[currentPage - 1].classList.add('active');
    }

    showPage(currentPage);
    createPaginationControls();
}

// Llama a paginateTable para cada tabla
document.addEventListener('DOMContentLoaded', () => {
    paginateTable('vacunas', rowsPerPage);
    paginateTable('desparasitaciones', rowsPerPage);
    paginateTable('controles', rowsPerPage);
});

////////////////////////////////////////////////////////////////
////certificafos

document.addEventListener('DOMContentLoaded', () => {
    // Obtener elementos del DOM
    const submitBtn = document.getElementById('submit-btn');
    const notificationModal = document.getElementById('notification-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const certificateSelect = document.getElementById('certificate-select');
    const petSelect = document.getElementById('pet-select');

    // Función para mostrar el modal
    function showModal() {
        notificationModal.classList.remove('hidden');
    }

    // Función para ocultar el modal
    function hideModal() {
        notificationModal.classList.add('hidden');
    }

    // Mostrar el modal si ambos campos están seleccionados
    submitBtn.addEventListener('click', () => {
        const selectedCertificate = certificateSelect.value;
        const selectedPet = petSelect.value;

        // Debugging: Verificar valores seleccionados
        console.log('Selected Certificate:', selectedCertificate);
        console.log('Selected Pet:', selectedPet);

        // Verificar si el valor del select para mascotas es correcto
        if (selectedPet === "" || selectedPet === null) {
            console.log('Error: No se seleccionó ninguna mascota.');
        } else {
            console.log('Mascota seleccionada:', selectedPet);
        }

        if (selectedCertificate && selectedPet) {
            showModal();
        } else {
            alert('Por favor, seleccione un certificado y una mascota.');
        }
    });

    // Cerrar el modal al hacer clic en el botón de cerrar (fuera del modal)
    modalClose.addEventListener('click', () => {
        hideModal();
    });

    // Cerrar el modal al hacer clic en el botón de cerrar dentro del modal
    modalCloseBtn.addEventListener('click', () => {
        hideModal();
    });
});

