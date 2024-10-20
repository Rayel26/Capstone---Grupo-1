async function toggleEditSaveProfile() {
    const isEditing = document.querySelector('#edit-save-button').textContent === 'Guardar';
    const emailInput = document.getElementById('email'); // Campo de correo
    const emailErrorMessage = document.getElementById('email-error-message'); // Mensaje de error de correo
    const phoneInput = document.getElementById('phone');
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
        await guardarPerfil(); // Llama a la función para guardar el perfil

        // Deshabilitar campos y cambiar estilos
        document.querySelectorAll('#profile-form input').forEach(input => {
            input.setAttribute('readonly', 'true');
            input.classList.add('bg-gray-50');
        });

        if (emailInput) {
            emailInput.setAttribute('readonly', 'true');
            emailInput.classList.add('bg-gray-50');
        } else {
            console.error('El elemento con ID "email" no se encontró.');
        }


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

        if (emailInput) {
            emailInput.removeAttribute('readonly');
            emailInput.classList.remove('bg-gray-50');
            emailInput.classList.add('bg-white');
        }

        editIcons.forEach(icon => {
            icon.classList.remove('hidden');
        });
        document.querySelector('#edit-save-button').textContent = 'Guardar';
    }
}

// Función para guardar el perfil
async function guardarPerfil() {
    const userId = sessionStorage.getItem('id_usuario'); // Asumiendo que tienes el id_usuario en sessionStorage

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('first-name').value;
    const appaterno = document.getElementById('last-name').value;
    const apmaterno = document.getElementById('maternal-last-name').value;
    const celular = document.getElementById('phone').value;
    const correo = document.getElementById('email').value;
    const direccion = document.getElementById('address').value;
    const numeracion = document.getElementById('numeration').value;

    // Crear el objeto de datos
    const data = {
        first_name: nombre,
        last_name: appaterno,
        maternal_last_name: apmaterno,
        phone: celular,
        email: correo,
        address: direccion,
        numeration: numeracion
    };

    try {
        const response = await fetch('/guardar-perfil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'first-name': nombre,
                'last-name': appaterno,
                'maternal-last-name': apmaterno,
                'phone': celular,
                'email': correo,
                'address': direccion,
                'numeration': numeracion
            })
        });

        // Comprobar la respuesta del servidor
        const result = await response.json();
        if (result.success) {
            alert('Perfil guardado exitosamente.');
            // Aquí puedes hacer algo adicional si es necesario, como redirigir al usuario
        } else {
            alert('Error al guardar el perfil: ' + result.message);
        }
    } catch (error) {
        console.error('Error al guardar el perfil:', error);
        alert('Error al conectar con el servidor.');
    }
}



// Función para mostrar el modal de eliminación
function showDeleteModal() {
    document.getElementById('delete-modal').classList.remove('hidden');
}

// Función para ocultar el modal de eliminación
function hideDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
}

// Event listener para el botón de cerrar el modal de eliminación
document.querySelector('#delete-modal button').addEventListener('click', () => {
    hideDeleteModal();
});

// Función para confirmar la eliminación de la cuenta
function confirmDeleteAccount() {
    fetch('/eliminar-cuenta', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        // Si todo va bien, el redireccionamiento se manejará desde el backend
        window.location.href = '/'; // Opcional, puede ser omitido
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al eliminar la cuenta.');
    });
}

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

function openDeleteModal() {
    document.getElementById('delete-modal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
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

    // Muestra una vista previa de la foto seleccionada
    document.getElementById('new-pet-photo').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result; // Actualiza la fuente de la vista previa
                photoPreview.style.display = 'block'; // Muestra la vista previa
            }
            reader.readAsDataURL(file);
        } else {
            photoPreview.style.display = 'none'; // Oculta la vista previa si no hay archivo
        }
    });

    document.getElementById('add-pet-form').addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el envío por defecto del formulario
    
        // Captura los datos del formulario
        const nombre = document.getElementById('new-pet-name').value;
        const especie = document.getElementById('new-pet-species').value;
        const fecha_nacimiento = document.getElementById('new-pet-birthdate').value;
        const edad = document.getElementById('new-pet-age').value;
        const foto = document.getElementById('new-pet-photo').files[0]; // Captura la foto
    
        let raza = (especie === 'perro') 
            ? document.getElementById('new-pet-breed-dog').value 
            : (especie === 'gato' ? document.getElementById('new-pet-breed-cat').value : '');
    
        // Validar que la raza está definida
        if (!raza) {
            console.error('La raza no está definida.');
            return; // Detener la ejecución si falta la raza
        }
    
        // Crear una nueva instancia de FormData
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('especie', especie);
        formData.append('raza', raza);
        formData.append('fecha_nacimiento', fecha_nacimiento);
        formData.append('edad', edad);
        formData.append('foto', foto); // Agregar la foto
    
        // Enviar la solicitud POST a tu servidor
        try {
            const response = await fetch('/add_pet', {
                method: 'POST',
                body: formData // No se necesita establecer Content-Type
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Mascota agregada:', data);
                // Aquí puedes agregar un mensaje de éxito o redireccionar a otra página
            } else {
                console.error('Error al agregar mascota:', data.error);
                // Aquí puedes mostrar un mensaje de error al usuario
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            // Manejo de errores en la solicitud
        }
    });
    
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
            petAge.value = calculatePetAge(birthdate); // Calcular edad aquí
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
        const age = document.getElementById('new-pet-birthdate').value
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
        newOption.setAttribute('data-age', calculatePetAge(birthdate)); // Calcular edad aquí
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
        petAge.value = calculatePetAge(birthdate); // Calcular edad aquí
        petSpecies.value = species;
        petBreed.value = breed;
        petBirthdate.value = birthdate;

        // Habilitar el botón de editar
        editButton.disabled = false;
    });

    /// ** Abre el modal para editar la mascota
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
            editPetAge.value = calculatePetAge(birthdate); // Calcular edad aquí

            // Mostrar especie y raza como texto
            editPetSpecies.value = species; // Establece la especie en el formulario
            // Mantener el campo de especie habilitado, pero puedes estilizarlo para que se vea diferente
            editPetSpecies.classList.add('read-only'); // Ejemplo de clase para estilos

            // Mostrar la raza correspondiente según la especie
            if (editDogBreedsDiv && editCatBreedsDiv) {
                if (species === 'perro') {
                    editPetBreedDog.value = breed; // Cargar raza si es perro
                    editPetBreedCat.value = ''; // Limpiar raza de gato
                    editDogBreedsDiv.style.display = 'block'; // Mostrar div de razas de perros
                    editCatBreedsDiv.style.display = 'none'; // Ocultar div de razas de gatos
                } else if (species === 'gato') {
                    editPetBreedCat.value = breed; // Cargar raza si es gato
                    editPetBreedDog.value = ''; // Limpiar raza de perro
                    editDogBreedsDiv.style.display = 'none'; // Ocultar div de razas de perros 
                    editCatBreedsDiv.style.display = 'block'; // Mostrar div de razas de gatos
                }
            } else {
                console.error('Los elementos de razas no están disponibles.');
            }
            
            
            // Mostrar el birthdate
            editPetBirthdate.value = birthdate;

            // Mostrar el modal
            editPetModal.classList.remove('hidden');
        } else {
            console.error('No hay una mascota seleccionada para editar.');
        }
    });

    // Obtén el botón de cerrar el modal usando el nuevo ID
    const closeEditModalButton = document.getElementById('close-edit-modal');

    // Función para cerrar el modal
    function closeEditPetModal() {
        editPetModal.classList.add('hidden');
    }

    // Evento para cerrar el modal al hacer clic en el botón de cerrar
    closeEditModalButton.addEventListener('click', closeEditPetModal);

    // Evento para manejar el envío del formulario de edición
    editPetForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario de edición
        const name = editPetName.value;
        const updatedBirthdate = editPetBirthdate.value; // Asegúrate de que esta línea esté aquí
        const species = editPetSpecies.value; // La especie no se puede editar, se usa el valor original

        // Seleccionar la raza correcta dependiendo de la especie
        let breed;
        if (species === 'perro') {
            breed = editPetBreedDog.value; // Raza para perros
        } else if (species === 'gato') {
            breed = editPetBreedCat.value; // Raza para gatos
        } else {
            breed = ''; // En caso de otra especie
        }

        const birthdate = editPetBirthdate.value;
        
        // Actualizar la opción en el <select> correspondiente
        const select = petSelect;
        const selectedOption = select.options[select.selectedIndex];
        selectedOption.setAttribute('data-name', name);
        selectedOption.setAttribute('data-birthdate', updatedBirthdate); // Actualizar fecha de nacimiento
        selectedOption.setAttribute('data-species', species); // La especie no cambia
        selectedOption.setAttribute('data-breed', breed); // La raza no cambia
        selectedOption.setAttribute('data-birthdate', birthdate);

        // Actualizar los valores visibles en el select
        selectedOption.textContent = name;

        // Limpiar el formulario y ocultar el modal
        editPetForm.reset();
        editPetModal.classList.add('hidden');
        
        // Actualizar campos de detalles de la mascota
        petName.value = name;
        petAge.value = calculatePetAge(updatedBirthdate); // Calcular edad aquí
        petSpecies.value = species; // La especie se mantiene
        petBreed.value = breed; // La raza no cambia
        petBirthdate.value = birthdate;

        // Habilitar el botón de editar
        editButton.disabled = false;
    });
    // Fin modal editar mascota

    // Maneja la carga de foto
    // Escucha el evento 'click' para abrir el selector de archivos
    document.getElementById('edit-photo-button').addEventListener('click', function () {
        document.getElementById('pet-photo').click();
    });

    // Escucha el cambio del input cuando se selecciona un archivo
    document.getElementById('pet-photo').addEventListener('change', function (event) {
        const file = event.target.files[0]; // Obtiene el archivo seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('photo-preview').src = e.target.result; // Muestra la imagen seleccionada
            }
            reader.readAsDataURL(file); // Lee el archivo como una URL de datos
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

// Cargar mascotas
async function loadPets() {
    try {
        const response = await fetch('/get_pets');
        if (!response.ok) {
            throw new Error('Error al cargar las mascotas: ' + response.statusText);
        }
        const pets = await response.json();

        const petSelect = document.getElementById('pet-select');
        const photoPreview = document.getElementById('photo-preview'); // Referencia al img donde se mostrará la imagen

        // Limpiar las opciones anteriores
        petSelect.innerHTML = '<option value="">Selecciona...</option>';

        // Agregar las mascotas al select
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id_mascota; // Usando 'id_mascota' como el identificador
            option.dataset.name = pet.nombre;
            option.dataset.age = pet.edad;
            option.dataset.species = pet.especie;
            option.dataset.breed = pet.raza;
            option.dataset.birthdate = pet.fecha_nacimiento;
            option.dataset.foto = pet.foto_url; // Añade la URL de la foto como dataset
            option.textContent = pet.nombre; // Muestra el nombre de la mascota
            petSelect.appendChild(option);
        });

        // Escuchar el cambio de selección en el select
        petSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (selectedOption.value !== "") {
                const fotoUrl = selectedOption.dataset.foto; // Obtener la URL de la foto
                
                // Verificar si hay una URL de foto válida
                if (fotoUrl) {
                    photoPreview.src = fotoUrl; // Asignar la URL de la foto al src del img
                } else {
                    // Si no hay foto, asignar una imagen por defecto
                    photoPreview.src = '/static/default-image.jpg'; // Ruta a la imagen por defecto
                }
            } else {
                // Si no hay selección, mostrar la imagen por defecto
                photoPreview.src = '/static/default-image.jpg';
            }
        });

    } catch (error) {
        console.error('Error al cargar las mascotas:', error);
    }
}

// Asegúrate de que la función se llame al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    loadPets(); // Llama a la función para cargar las mascotas
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
////certificados
document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submit-btn');
    const notificationModal = document.getElementById('notification-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const petSelect = document.getElementById('mascota-select');
    const modalPet = document.getElementById('modal-pet');
    const modalCertificates = document.getElementById('modal-certificates');

    function showModal(modal) {
        modal.classList.remove('hidden');
    }

    function hideModal(modal) {
        modal.classList.add('hidden');
    }

    function showCertificatesConfirmation() {
        const selectedCertificates = [];
        document.querySelectorAll('input[name="certificates"]:checked').forEach((checkbox) => {
            selectedCertificates.push(checkbox.nextSibling.textContent.trim());
        });

        if (selectedCertificates.length === 0) {
            alert("Por favor, seleccione al menos un certificado.");
            return;
        }

        modalCertificates.innerHTML = `<strong>Certificados seleccionados:</strong> ${selectedCertificates.join(', ')}`;
        showModal(notificationModal);
    }

    function showConfirmation() {
        const selectedPet = petSelect.options[petSelect.selectedIndex].text;

        if (selectedPet === "-- Seleccione una mascota --") {
            alert("Por favor, seleccione una mascota.");
            return;
        }

        modalPet.innerHTML = `<strong>Mascota seleccionada:</strong> ${selectedPet}`;
        showCertificatesConfirmation();
    }

    submitBtn.addEventListener('click', () => {
        showConfirmation();
    });

    modalClose.addEventListener('click', () => {
        hideModal(notificationModal);
    });

    modalCloseBtn.addEventListener('click', () => {
        hideModal(notificationModal);
        // Aquí puedes agregar lógica para mostrar otro modal si es necesario
    });
});

// Selecciona el input de fecha
const dateInput = document.getElementById('pet-birthdate');

// Añade un evento click al input de fecha
dateInput.addEventListener('click', function() {
    this.showPicker(); // Muestra el selector de fecha
});

// Selecciona el input de fecha
const newDateInput = document.getElementById('new-pet-birthdate');

 // Añade un evento click al input de fecha
newDateInput.addEventListener('click', function() {
    this.showPicker(); // Muestra el selector de fecha
});

// Selecciona el input de fecha
const editDateInput = document.getElementById('edit-pet-birthdate');

// Añade un evento click al input de fecha
editDateInput.addEventListener('click', function() {
    this.showPicker(); // Muestra el selector de fecha
});