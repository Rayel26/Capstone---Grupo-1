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


//////////
// Ficha Clinica:

// Script para el comportamiento de las pestañas

// Lógica de navegación de pestañas
const tabButtons = document.querySelectorAll('a[id$="-btn"]'); // Selector para botones de pestañas
const tabContents = document.querySelectorAll('div[id^="tab"]'); // Selector para contenidos de pestañas

tabButtons.forEach(tab => {
    tab.addEventListener('click', (e) => {
        e.preventDefault();

        // Eliminar clase activa de todas las pestañas
        tabButtons.forEach(t => {
            t.classList.remove('text-blue-500', 'border-gray-300');
            t.classList.add('text-gray-500'); // Cambia a texto gris
        });

        // Ocultar todo el contenido de las pestañas
        tabContents.forEach(content => content.classList.add('hidden'));

        // Añadir clase activa a la pestaña seleccionada y mostrar contenido relacionado
        tab.classList.add('text-blue-500', 'border-gray-300'); // Cambia a texto azul
        const targetContent = document.querySelector(tab.getAttribute('href'));
        targetContent.classList.remove('hidden'); // Muestra el contenido de la pestaña seleccionada
    });
});
// Fin Script para el comportamiento de las pestañas -->



////////////
// Ficha clinica
// Ejemplo de datos de mascotas (esto normalmente vendría de una base de datos)
const petsData = {
    "12345678-9": [
        {
            id: 1,
            name: "Firulais",
            birthDate: "01/01/2020",
            age: "4 años",
            gender: "Macho",
            weight: "10 kg",
            microchip: "123456789",
            species: "Perro",
            breed: "Labrador",
            size: "Mediano",
            coatColor: "Amarillo",
            clinicalHistory: "Sin antecedentes.",
            vaccines: "Vacuna antirrábica, vacuna cuadrivalente.",
            dewormings: "Desparacitación anual.",
            studies: "Análisis de sangre 2023",
            owner: {
                name: "Juan Pérez",
                address: "Calle Falsa 123",
                phone: "123456789",
                email: "juan.perez@example.com"
            }
        },
        {
            id: 2,
            name: "Miau",
            birthDate: "05/05/2019",
            age: "5 años",
            gender: "Hembra",
            weight: "5 kg",
            microchip: "987654321",
            species: "Gato",
            breed: "Siames",
            size: "Pequeño",
            coatColor: "Blanco",
            clinicalHistory: "Sin antecedentes.",
            vaccines: "Vacuna antirrábica.",
            dewormings: "Desparacitación semestral.",
            studies: "Análisis de sangre 2022",
            owner: {
                name: "Ana Gómez",
                address: "Avenida Siempre Viva 742",
                phone: "987654321",
                email: "ana.gomez@example.com"
            }
        }
    ]
};

// Función para buscar por RUT
function searchPetByRUT() {
    const rut = document.getElementById("rut-paciente-nuevo").value;
    const pets = petsData[rut];

    // Limpiar el select de mascotas
    const petSelect = document.getElementById("pet-select");
    petSelect.innerHTML = ""; // Limpiar opciones previas

    if (pets) {
        pets.forEach(pet => {
            const option = document.createElement("option");
            option.value = pet.id;
            option.textContent = pet.name;
            petSelect.appendChild(option);
        });
        
        // Mostrar los datos del dueño
        document.getElementById("owner-name").textContent = pets[0].owner.name;
        document.getElementById("owner-address").textContent = pets[0].owner.address;
        document.getElementById("owner-phone").textContent = pets[0].owner.phone;
        document.getElementById("owner-email").textContent = pets[0].owner.email;
        
        // Mostrar la sección con datos del dueño
        document.getElementById("pet-data").classList.remove("hidden");
        
        // Mostrar datos de la primera mascota por defecto
        showPetData(pets[0]);
    } else {
        alert("No se encontraron mascotas para este RUT.");
        document.getElementById("pet-data").classList.add("hidden");
    }
}

// Función para mostrar los datos de la mascota seleccionada
function showPetData(pet) {
    document.getElementById("pet-name").value = pet.name;
    document.getElementById("birth-date").value = pet.birthDate;
    document.getElementById("age").value = pet.age;
    document.getElementById("gender").value = pet.gender;
    document.getElementById("weight").value = pet.weight;
    document.getElementById("microchip-number").value = pet.microchip;
    document.getElementById("species").value = pet.species;
    document.getElementById("breed").value = pet.breed;
    document.getElementById("size").value = pet.size;
    document.getElementById("coat-color").value = pet.coatColor;

    // Aquí deberías agregar lógica para mostrar la historia clínica, vacunas, desparasitaciones y estudios
    document.getElementById("tab2").innerHTML = `<p>${pet.clinicalHistory}</p>`;
    document.getElementById("tab3").innerHTML = `<p>${pet.vaccines}</p>`;
    document.getElementById("tab4").innerHTML = `<p>${pet.dewormings}</p>`;
    document.getElementById("tab5").innerHTML = `<p>${pet.studies}</p>`;
}

// Evento para cambiar la mascota seleccionada
document.getElementById("pet-select").addEventListener("change", function() {
    const selectedPetId = this.value;
    const rut = document.getElementById("rut-paciente-nuevo").value;
    const pets = petsData[rut];

    const selectedPet = pets.find(pet => pet.id == selectedPetId);
    if (selectedPet) {
        showPetData(selectedPet);
    }
});

/// Script para manejar el modal de detalles de la cita (historia clinica)-->

    function openModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.getElementById(modalId).classList.add('show');
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        document.getElementById(modalId).classList.add('hidden');
    }

    // Cerrar el modal al hacer clic fuera del contenido
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach((modal) => {
            if (event.target === modal) {
                closeModal(modal.id);
            }
        });
    }
/// Fin Script para manejar el modal de detalles de la cita-->

/// Script para manejar el modal de vacunas-->
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}
/// Fin Script para manejar el modal de vacunas-->

/// Script para manejar el modal de desparacitaciones-->
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
    modal.querySelector('.transform').classList.add('scale-100');
    modal.querySelector('.transform').classList.remove('scale-95');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.querySelector('.transform').classList.add('scale-95');
    modal.querySelector('.transform').classList.remove('scale-100');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // Retraso para que la animación ocurra antes de ocultar
}

/// Fin Script para manejar el modal de desparacitaciones-->