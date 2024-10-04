// Función para mostrar secciones
function showSection(sectionId, button) {
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        section.classList.add('hidden'); // Ocultar todas las secciones
    });
    document.getElementById(sectionId).classList.remove('hidden'); // Mostrar la sección seleccionada

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-blue-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-800'); // Cambiar estilo de todos los botones
    });
    button.classList.add('bg-blue-500', 'text-white'); // Estilo del botón seleccionado
    button.classList.remove('bg-gray-200', 'text-gray-800');
}

// Mostrar la sección de Datos del Doctor al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('doctor-info', document.querySelector('.tab-button')); // Muestra Datos del Doctor por defecto
});


// Datos del doctor
document.getElementById('upload-photo').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-picture').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});
// Fin Datos del doctor 

/// Script para manejo del modal 

// Obtener elementos del DOM
const editBtn = document.getElementById('editBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const editForm = document.getElementById('editForm');
const telefonoInput = document.getElementById('edit-telefono-dom');
const telefonoError = document.getElementById('telefonoError');
const rutInput = document.getElementById('edit-rut');
const rutError = document.getElementById('rutError');

// Abrir el modal al hacer clic en el botón de Editar
editBtn.addEventListener('click', function() {
    editModal.classList.remove('hidden');
});

// Cerrar el modal al hacer clic en Cancelar
closeModalBtn.addEventListener('click', function() {
    editModal.classList.add('hidden');
});

// Función para formatear el RUT
function formatRUT(value) {
    // Eliminar cualquier carácter que no sea un número o la letra K
    let rut = value.replace(/[^0-9kK]/g, '');

    // Si ya tiene más de 9 caracteres, no permitir agregar más
    if (rut.length > 9) {
        rut = rut.substring(0, 9);
    }

    // Formatear agregando puntos y guion
    if (rut.length > 1) {
        rut = rut.slice(0, -1) + '-' + rut.slice(-1);
    }
    if (rut.length > 5) {
        rut = rut.slice(0, -5) + '.' + rut.slice(-5);
    }
    if (rut.length > 9) {
        rut = rut.slice(0, -9) + '.' + rut.slice(-9);
    }

    return rut;
}

// Validar y formatear RUT en tiempo real
rutInput.addEventListener('input', function() {
    rutInput.value = formatRUT(rutInput.value);
    
    const rut = rutInput.value;
    const rutPattern = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/; // Expresión regular para el formato del RUT chileno
    if (!rutPattern.test(rut)) {
        rutError.classList.remove('hidden');
        rutInput.setCustomValidity('Formato incorrecto.');
    } else {
        rutError.classList.add('hidden');
        rutInput.setCustomValidity('');
    }
});

// Validar formato de número de teléfono
telefonoInput.addEventListener('input', function() {
    // Asegurar que el teléfono comience con +569- y agregar guión si no está presente
    if (!telefonoInput.value.startsWith('+569-')) {
        telefonoInput.value = '+569-';
    }

    // Extraer el número ingresado sin el prefijo
    const numberPart = telefonoInput.value.replace('+569-', '');

    // Limitar la entrada a 8 números
    const maxLength = 8;
    const digitsOnly = numberPart.replace(/\D/g, '').slice(0, maxLength); // Solo obtener dígitos y limitar a 8
    telefonoInput.value = `+569-${digitsOnly}`;

    // Validar la longitud total (+569-xxxx xxxx) -> 13 caracteres
    if (telefonoInput.value.length !== 13) {
        telefonoError.classList.remove('hidden');
        telefonoInput.setCustomValidity('Formato incorrecto. Debe tener 8 dígitos después de +569-.');
    } else {
        telefonoError.classList.add('hidden');
        telefonoInput.setCustomValidity('');
    }
});

// Actualizar los datos después de guardar en el modal
editForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Actualizar valores en la vista principal
    document.getElementById('rut').value = document.getElementById('edit-rut').value;
    document.getElementById('nombre-doctor').value = document.getElementById('edit-nombre-doctor').value;
    document.getElementById('apellido').value = document.getElementById('edit-apellido').value;
    document.getElementById('especialidad').value = document.getElementById('edit-especialidad').value;
    document.getElementById('domicilio').value = document.getElementById('edit-domicilio').value;
    document.getElementById('telefono-dom').value = document.getElementById('edit-telefono-dom').value;
    document.getElementById('correo').value = document.getElementById('edit-correo').value;
    document.getElementById('fecha-nacimiento').value = document.getElementById('edit-fecha-nacimiento').value;

    // Cerrar el modal
    editModal.classList.add('hidden');
});


//Ficha Clinica


// Datos de ejemplo para mascotas
const petRecords = [
    {
        rut: '12.345.678-9',
        species: 'Perro',
        breed: 'Labrador',
        size: 'Grande',
        name: 'Firulais',
        birthDate: '2018-01-01',
        age: '6',
        gender: 'Macho',
        weight: '30kg',
        microchipNumber: '123456789',
        ownerName: 'Juan Pérez',
        ownerAddress: 'Calle Falsa 123',
        ownerPhone: '987654321',
        ownerEmail: 'juan.perez@example.com'
    },
    {
        rut: '21.876.543-0',
        species: 'Gato',
        breed: 'Siamés',
        size: 'Pequeño',
        name: 'Mimi',
        birthDate: '2020-05-15',
        age: '4',
        gender: 'Hembra',
        weight: '4kg',
        microchipNumber: '987654321',
        ownerName: 'María López',
        ownerAddress: 'Avenida Siempre Viva 456',
        ownerPhone: '123456789',
        ownerEmail: 'maria.lopez@example.com'
    },
    // Añadir más registros según sea necesario
];


// Función para buscar mascotas por RUT
function searchPetByRUT() {
    const rutInput = document.getElementById('rut-paciente').value; 
    const normalizedRUT = rutInput.replace(/\D/g, ''); 
    let foundPet = null;

    for (let record of petRecords) {
        const recordNormalizedRUT = record.rut.replace(/\D/g, '');
        if (recordNormalizedRUT === normalizedRUT) {
            foundPet = record;
            break;
        }
    }

    const petData = document.getElementById('pet-data');
    const errorMessage = document.getElementById('error-message');

    if (foundPet) {
        // Mostrar datos de la mascota
        document.getElementById('species').textContent = foundPet.species;
        document.getElementById('breed').textContent = foundPet.breed;
        document.getElementById('size').textContent = foundPet.size;
        document.getElementById('pet-name').textContent = foundPet.name;
        document.getElementById('birth-date').textContent = foundPet.birthDate;
        document.getElementById('age').textContent = foundPet.age;
        document.getElementById('gender').textContent = foundPet.gender;
        document.getElementById('weight').textContent = foundPet.weight;
        document.getElementById('microchip-number').textContent = foundPet.microchipNumber;
    
        // Mostrar datos del dueño
        document.getElementById('owner-name').textContent = foundPet.ownerName;
        document.getElementById('owner-address').textContent = foundPet.ownerAddress;
        document.getElementById('owner-phone').textContent = foundPet.ownerPhone;
        document.getElementById('owner-email').textContent = foundPet.ownerEmail;
    
        petData.classList.remove('hidden');
        errorMessage.textContent = '';
    } else {
        errorMessage.textContent = 'No se encontró ninguna mascota con ese RUT.';
        petData.classList.add('hidden');
    }
    

    return false; 
}



