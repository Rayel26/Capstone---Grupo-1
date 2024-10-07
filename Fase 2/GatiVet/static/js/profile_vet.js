// Función para mostrar secciones
function showSection(sectionId, button) {
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        section.classList.add('hidden'); // Ocultar todas las secciones
    });
    document.getElementById(sectionId).classList.remove('hidden'); // Mostrar la sección seleccionada

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-green-500', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-800'); // Cambiar estilo de todos los botones
    });
    button.classList.add('bg-green-500', 'text-white'); // Estilo del botón seleccionado
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
            t.classList.remove('text-green-500', 'border-gray-300');
            t.classList.add('text-gray-500'); // Cambia a texto gris
        });

        // Ocultar todo el contenido de las pestañas
        tabContents.forEach(content => content.classList.add('hidden'));

        // Añadir clase activa a la pestaña seleccionada y mostrar contenido relacionado
        tab.classList.add('text-green-500', 'border-gray-300'); // Cambia a texto azul
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

//Inicio Script relacionado a datos de mascota

// Obtener los elementos necesarios
const saveStatusBtn = document.getElementById('save-status-btn');
const reproducerCheckbox = document.getElementById('reproducer');
const treatmentCheckbox = document.getElementById('treatment');
const sterilizedCheckbox = document.getElementById('sterilized');
const deceasedCheckbox = document.getElementById('deceased');
const causeOfDeathInput = document.getElementById('cause-of-death');
const statusInfoDiv = document.getElementById('status-info');
const saveMessage = document.getElementById('save-message');

// Función que se ejecuta al presionar "Guardar Estado"
saveStatusBtn.addEventListener('click', function() {
    // Limpiar el área de estado
    statusInfoDiv.innerHTML = '';

    // Crear una lista para almacenar los estados seleccionados
    let statusList = [];

    // Verificar las casillas de verificación y agregar texto correspondiente
    if (reproducerCheckbox.checked) {
        statusList.push("Es reproductor.");
    }
    if (treatmentCheckbox.checked) {
        statusList.push("Está en tratamiento anticonceptivo.");
    }
    if (sterilizedCheckbox.checked) {
        statusList.push("Está esterilizado/castrado.");
    }
    if (deceasedCheckbox.checked) {
        // Verificar si se ha proporcionado una causa de muerte
        const causeOfDeath = causeOfDeathInput.value.trim();
        if (causeOfDeath) {
            statusList.push(`Falleció. Causa del deceso: ${causeOfDeath}`);
        } else {
            statusList.push("Falleció.");
        }
    }

    // Si no hay ninguna opción seleccionada, mostrar un mensaje
    if (statusList.length === 0) {
        statusInfoDiv.innerHTML = "No se ha seleccionado ningún estado.";
    } else {
        // Mostrar el estado debajo de la imagen
        statusInfoDiv.innerHTML = statusList.join(' <br> ');
    }

    // Mostrar un mensaje de éxito temporalmente
    saveMessage.textContent = "Estado guardado correctamente.";
    setTimeout(() => {
        saveMessage.textContent = '';
    }, 2000);
});

//Fin de script relacionado a datos de mascotas

////////////////////////////////
//Inicio de Script de Ficha

// Guardar la información
document.getElementById('saveButton').addEventListener('click', () => {
    document.getElementById('confirmationModal').classList.remove('hidden');
});

document.getElementById('confirmSave').addEventListener('click', () => {
    const ownerData = {
        ownerName: document.getElementById('ownerName').value,
        ownerLastName: document.getElementById('ownerLastName').value,
        ownerRUT: document.getElementById('ownerRUT').value,
        ownerID: document.getElementById('ownerID').value,
        ownerAddress: document.getElementById('ownerAddress').value,
        ownerPhone: document.getElementById('ownerPhone').value,
        ownerEmail: document.getElementById('ownerEmail').value
    };

    const patientData = {
        patientName: document.getElementById('patientName').value,
        patientSpecies: document.getElementById('patientSpecies').value,
        patientBreed: document.getElementById('patientBreed').value,
        patientSex: document.getElementById('patientSex').value,
        patientBirthDate: document.getElementById('patientBirthDate').value,
        patientWeight: document.getElementById('patientWeight').value,
        patientColor: document.getElementById('patientColor').value,
        patientFurType: document.getElementById('patientFurType').value,
        consultationReason: document.getElementById('consultationReason').value
    };

    // Guardar en localStorage
    localStorage.setItem('ownerData', JSON.stringify(ownerData));
    localStorage.setItem('patientData', JSON.stringify(patientData));

    // Cerrar el modal
    document.getElementById('confirmationModal').classList.add('hidden');

    alert('Ficha guardada exitosamente.');
});

document.getElementById('cancelSave').addEventListener('click', () => {
    document.getElementById('confirmationModal').classList.add('hidden');
});

// Cargar datos guardados al abrir la pestaña
window.onload = () => {
    const ownerData = JSON.parse(localStorage.getItem('ownerData'));
    const patientData = JSON.parse(localStorage.getItem('patientData'));

    if (ownerData) {
        document.getElementById('ownerName').value = ownerData.ownerName;
        document.getElementById('ownerLastName').value = ownerData.ownerLastName;
        document.getElementById('ownerRUT').value = ownerData.ownerRUT;
        document.getElementById('ownerID').value = ownerData.ownerID;
        document.getElementById('ownerAddress').value = ownerData.ownerAddress;
        document.getElementById('ownerPhone').value = ownerData.ownerPhone;
        document.getElementById('ownerEmail').value = ownerData.ownerEmail;
    }

    if (patientData) {
        document.getElementById('patientName').value = patientData.patientName;
        document.getElementById('patientSpecies').value = patientData.patientSpecies;
        document.getElementById('patientBreed').value = patientData.patientBreed;
        document.getElementById('patientSex').value = patientData.patientSex;
        document.getElementById('patientBirthDate').value = patientData.patientBirthDate;
        document.getElementById('patientWeight').value = patientData.patientWeight;
        document.getElementById('patientColor').value = patientData.patientColor;
        document.getElementById('patientFurType').value = patientData.patientFurType;
        document.getElementById('consultationReason').value = patientData.consultationReason;
    }
};

//Fin de script de Ficha

///////////////////////////////////////////////////////
// Script para editar información de modals de citas
function guardarCambios(id) {
    // Obtener los valores actualizados del modal correspondiente
    const nuevaFecha = document.getElementById(`editFecha${id}`).value;
    const nuevoMotivo = document.getElementById(`editMotivo${id}`).value;
    const nuevoDiagnostico = document.getElementById(`editDiagnostico${id}`).value;
    const nuevoTratamiento = document.getElementById(`editTratamiento${id}`).value;

    // Actualizar los valores en la tabla correspondiente
    document.getElementById(`citaFecha${id}`).textContent = nuevaFecha;
    document.getElementById(`citaMotivo${id}`).textContent = nuevoMotivo;
    document.getElementById(`citaDiagnostico${id}`).textContent = nuevoDiagnostico;
    document.getElementById(`citaTratamiento${id}`).textContent = nuevoTratamiento;

    // Cerrar el modal después de guardar los cambios
    closeModal('modal' + id);
}

// Función para guardar cambios de vacunas
function guardarCambiosVacuna(vacunaId) {
    const vacufecha = document.getElementById(`editVacunaFecha${vacunaId}`).value;
    const producto = document.getElementById(`editVacunaNombre${vacunaId}`).value;
    const dosis = document.getElementById(`editVacunaDosis${vacunaId}`).value;
    const veterinario = document.getElementById(`editVacunaVeterinario${vacunaId}`).value;

    // Aquí puedes agregar el código para guardar estos cambios en el servidor o en una base de datos
    // Actualizar los valores en la tabla correspondiente
    document.getElementById(`vacunaFecha${vacunaId}`).textContent = vacufecha;
    document.getElementById(`vacunaNombre${vacunaId}`).textContent = producto;
    document.getElementById(`vacunaDosis${vacunaId}`).textContent = dosis;
    document.getElementById(`vacunaVeterinario${vacunaId}`).textContent = veterinario;
    // Por ejemplo, simplemente mostrar una alerta como confirmación
    closeModal(`modalVacuna${vacunaId}`); // Cerrar el modal
}

// Función para guardar cambios de desparasitaciones
function guardarCambiosDesparasitacion(desparasitacionId) {
    const desfecha = document.getElementById(`editDesparasitacionFecha${desparasitacionId}`).value;
    const producto = document.getElementById(`editDesparasitacionProducto${desparasitacionId}`).value;
    const dosis = document.getElementById(`editDesparasitacionDosis${desparasitacionId}`).value;
    const veterinario = document.getElementById(`editDesparasitacionVeterinario${desparasitacionId}`).value;

    // Actualizar los valores en la tabla correspondiente
    document.getElementById(`desparasitacionFecha${desparasitacionId}`).textContent = desfecha;
    document.getElementById(`desparasitacionProducto${desparasitacionId}`).textContent = producto;
    document.getElementById(`desparasitacionDosis${desparasitacionId}`).textContent = dosis;
    document.getElementById(`desparasitacionVeterinario${desparasitacionId}`).textContent = veterinario;
    // Por ejemplo, simplemente mostrar una alerta como confirmación
    closeModal(`modalDesparasitacion${desparasitacionId}`); // Cerrar el modal
}

//////////////////////////////////////////////////
//Script para Agenda

// JavaScript para cambiar entre vistas
const toggleButton = document.getElementById('toggleView');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const weeklyView = document.getElementById('weeklyView');
const monthlyView = document.getElementById('monthlyView');
const calendarDays = document.getElementById('calendarDays');
const monthTitle = document.getElementById('monthTitle');

let currentYear = 2024;
let currentMonth = 9; // Octubre (0-indexado)

// Datos de citas para mostrar en el calendario
const appointments = {
    7: [
        { time: '11:00 - 12:00', pet: 'COOKIE', color: 'bg-yellow-100' },
        { time: '13:00 - 14:00', pet: 'BELLA', color: 'bg-blue-100' }
    ],
    8: [
        { time: '10:30 - 11:30', pet: 'MANDARINA', color: 'bg-green-100' },
        { time: '15:00 - 16:00', pet: 'LUNA', color: 'bg-red-100' },
    ],
    9: [
        { time: '09:00 - 10:00', pet: 'MAX', color: 'bg-purple-100' },
    ],
    10: [
        { time: '14:00 - 15:00', pet: 'RUFUS', color: 'bg-orange-100' },
    ],
    // Agrega más citas aquí con la misma estructura
};

// Array de nombres de meses
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Función para generar días del mes
function generateCalendar(year, month) {
    // Limpiar los días del calendario
    calendarDays.innerHTML = '';

    // Cambiar el título del mes
    monthTitle.textContent = `Mi Agenda - ${monthNames[month]} ${year}`;

    // Obtener el primer día del mes y el número de días
    const firstDay = new Date(year, month, 1);
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startDay = firstDay.getDay(); // Día de la semana (0-6)

    // Agregar días vacíos antes del primer día del mes
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarDays.appendChild(emptyDiv);
    }

    // Agregar días del mes
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'border p-1 relative'; // Hacer que el padding sea más pequeño

        // Tachado solo para sábados y domingos
        const dayOfWeek = (startDay + day - 1) % 7; // Obtener el índice del día de la semana
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Domingo (0) y Sábado (6)
            dayDiv.classList.add('weekend');
        } else {
            // Solo crear tarjetas para días de semana (lunes a viernes)
            dayDiv.textContent = day;

            // Mostrar citas si hay
            if (appointments[day]) {
                const appointmentList = document.createElement('div');
                appointmentList.className = 'mt-1'; // Margen superior para la lista de citas

                appointments[day].forEach(appointment => {
                    const appointmentDiv = document.createElement('div');
                    appointmentDiv.className = `appointment-card rounded-md shadow-md p-1 text-xs ${appointment.color} mb-1`;
                    appointmentDiv.textContent = `${appointment.time}: ${appointment.pet}`;
                    appointmentList.appendChild(appointmentDiv);
                });

                dayDiv.appendChild(appointmentList);
            }
        }

        calendarDays.appendChild(dayDiv);
    }
}

// Inicializar el calendario
generateCalendar(currentYear, currentMonth);

// Cambiar entre vista semanal y mensual
toggleButton.addEventListener('click', () => {
    if (weeklyView.classList.contains('hidden')) {
        weeklyView.classList.remove('hidden');
        monthlyView.classList.add('hidden');
        toggleButton.textContent = 'Cambiar a Vista Mensual';
        prevMonthButton.classList.add('hidden'); // Ocultar botones de navegación en vista semanal
        nextMonthButton.classList.add('hidden');
    } else {
        weeklyView.classList.add('hidden');
        monthlyView.classList.remove('hidden');
        toggleButton.textContent = 'Cambiar a Vista Semanal';
        prevMonthButton.classList.remove('hidden'); // Mostrar botones de navegación en vista mensual
        nextMonthButton.classList.remove('hidden');
    }
});

// Navegar entre meses
prevMonthButton.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    generateCalendar(currentYear, currentMonth);
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    generateCalendar(currentYear, currentMonth);
});

//Modal de la agenda

// Función para abrir el modal con detalles dinámicos
function openModalWeek(type, owner, email, phone, petIcon, pet, breed, sex, startTime, endTime, typeInfo, reason, date) {
    document.getElementById('modalweek-type').innerText = `Cita: ${type}`;
    document.getElementById('modalweek-owner').innerText = owner;
    document.getElementById('modalweek-email').innerText = email;
    document.getElementById('modalweek-phone').innerText = phone;
    document.getElementById('modalweek-pet-icon').className = petIcon; // Icono de perro o gato
    document.getElementById('modalweek-pet').innerText = pet;
    document.getElementById('modalweek-breed').innerText = `${breed}, ${sex}`;
    document.getElementById('modalweek-start-time').innerText = startTime;
    document.getElementById('modalweek-end-time').innerText = endTime;
    document.getElementById('modalweek-type-info').innerText = typeInfo;
    document.getElementById('modalweek-reason').innerText = reason;
    document.getElementById('modalweek-date').innerText = date;
    document.getElementById('modalweek').classList.remove('hidden');
}

// Función para cerrar el modal
function closeModalWeek() {
    document.getElementById('modalweek').classList.add('hidden');
}

// Función para cancelar la cita
function cancelAppointmentWeek() {
    const appointmentCard = document.querySelector('.appointment-card[onclick*="Presencial"]'); // Selecciona la tarjeta actual
    if (appointmentCard) {
        appointmentCard.remove(); // Elimina la tarjeta visualmente
    }
    alert("Cita cancelada");
    closeModalWeek();
}


// Variables para almacenar el estado de la cita
let isEditing = false;

function editAppointmentWeek() {
    const startTimeInput = document.getElementById("modalweek-start-time");
    const endTimeInput = document.getElementById("modalweek-end-time");
    const editTime = document.getElementById("editTime");

    if (isEditing) {
        // Guardar los cambios
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        // Aquí podrías realizar una acción para guardar los datos, como enviar a un servidor.
        console.log("Guardando cambios:", startTime, endTime);

        // Alertar que los cambios se realizaron correctamente
        alert("Los cambios se realizaron correctamente.");

        // Cambiar el texto del botón de nuevo a "Editar"
        editTime.textContent = "Editar";
        // Deshabilitar los inputs
        startTimeInput.disabled = true;
        endTimeInput.disabled = true;
    } else {
        // Activar la edición
        editTime.textContent = "Guardar Cambios";
        startTimeInput.disabled = false;
        endTimeInput.disabled = false;
    }

    // Alternar el estado de edición
    isEditing = !isEditing;
}

// Selecciona el input de tiempo
const timeInput = document.getElementById('consultationStartTime');

// Agrega un evento de clic al input
timeInput.addEventListener('click', function () {
    this.showPicker(); // Muestra el selector de tiempo (timepicker)
});


/////////////////////////////////////////////
//Script para agregar vacunas

function openAddVaccineModal() {
    document.getElementById('addVaccineModal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function addVaccine() {
    // Obtener valores de los campos del formulario
    const fecha = document.getElementById('vacunaFecha').value;
    const nombre = document.getElementById('vacunaNombre').value;
    const dosis = document.getElementById('vacunaDosis').value;
    const veterinario = document.getElementById('vacunaVeterinario').value;

    // Verificar que los campos no estén vacíos
    if (!fecha || !nombre || !dosis || !veterinario) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear una nueva fila en la tabla
    const tbody = document.getElementById('vacunasTableBody'); // Cambié a usar el ID
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td class="border border-gray-300 px-2 py-1">${fecha}</td>
        <td class="border border-gray-300 px-2 py-1">${nombre}</td>
        <td class="border border-gray-300 px-2 py-1">${dosis}</td>
        <td class="border border-gray-300 px-2 py-1">${veterinario}</td>
        <td class="border border-gray-300 px-2 py-1">
            <button class="text-green-500 hover:underline" onclick="openModal('modalVacunaN')">Ver detalles</button>
        </td>
    `;
    tbody.appendChild(newRow);

    // Cerrar el modal
    closeModal();

    // Limpiar el formulario
    document.getElementById('addVaccineForm').reset();
}

//Script para agregar desparasitaciones

function openDesparasitacionModal() {
    document.getElementById('desparasitacionModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('desparasitacionModal').classList.add('hidden');
}

function addDesparasitacion() {
    // Obtener los valores del modal
    const fecha = document.getElementById('newDesparasitacionFecha').value;
    const producto = document.getElementById('newDesparasitacionProducto').value;
    const dosis = document.getElementById('newDesparasitacionDosis').value;
    const veterinario = document.getElementById('newDesparasitacionVeterinario').value;

    // Validar que todos los campos estén llenos
    if (!fecha || !producto || !dosis || !veterinario) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear una nueva fila en la tabla
    const tbody = document.getElementById('desparasitacionesTableBody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td class="border border-gray-300 px-2 py-1">${fecha}</td>
        <td class="border border-gray-300 px-2 py-1">${producto}</td>
        <td class="border border-gray-300 px-2 py-1">${dosis}</td>
        <td class="border border-gray-300 px-2 py-1">${veterinario}</td>
        <td class="border border-gray-300 px-2 py-1">
            <button class="text-green-500 hover:underline" onclick="openModal('modalDesparasitacionNew')">Ver detalles</button>
        </td>
    `;

    // Agregar la nueva fila al tbody
    tbody.appendChild(newRow);

    // Limpiar los campos del modal
    document.getElementById('newDesparasitacionFecha').value = '';
    document.getElementById('newDesparasitacionProducto').value = '';
    document.getElementById('newDesparasitacionDosis').value = '';
    document.getElementById('newDesparasitacionVeterinario').value = ''
}

//Modal PDF
function openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.add('hidden');
}