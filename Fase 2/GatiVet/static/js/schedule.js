// Función para cambiar de paso
function nextStep(currentStep, nextStep, currentIcon) {
    document.getElementById(currentStep).classList.add('hidden');
    document.getElementById(nextStep).classList.remove('hidden');
    
    const stepIcons = document.querySelectorAll('.step-icon');
    stepIcons.forEach(icon => icon.classList.remove('step-icon-active'));
    document.getElementById(currentIcon).classList.add('step-icon-active');
}

// Validar RUT
function isValidRut(rut) {
    const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    return rutPattern.test(rut);
}

// Formatear RUT
function formatRut() {
    const input = document.getElementById('rut-input');
    let value = input.value.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no válidos

    if (value.length > 8) {
        value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '-' + value.slice(8, 9); // Formatear
    } else if (value.length > 5) {
        value = value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5); // Formatear
    } else if (value.length > 2) {
        value = value.slice(0, 2) + '.' + value.slice(2); // Formatear
    }

    input.value = value;
}

// Cambiar entre búsqueda por staff y servicio
function toggleSearch(searchType) {
    document.getElementById('service-search').classList.add('hidden');
    document.getElementById('staff-search').classList.add('hidden');

    if (searchType === 'staff') {
        document.getElementById('staff-search').classList.remove('hidden');
    } else if (searchType === 'service') {
        document.getElementById('service-search').classList.remove('hidden');
    }
}

// Actualizar la información del doctor seleccionado
function updateDoctorInfoFromSelection() {
    const selectedOption = document.querySelector('#staff-select option:checked');
    const doctorName = selectedOption.getAttribute('data-name');
    const doctorImage = selectedOption.getAttribute('data-image');

    if (doctorName) {
        document.getElementById('doctor-name').innerText = doctorName;
        document.getElementById('doctor-image').src = doctorImage;
    }
}

// Establecer la hora seleccionada
document.querySelectorAll('#time-select button').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('selected-time').value = this.getAttribute('data-time');
    });
});

// Validar la selección de fecha y hora
function validateDateTime() {
    const selectedDate = document.getElementById('date-select').value;
    const selectedTime = document.getElementById('selected-time').value;
    if (!selectedDate || !selectedTime) {
        alert('Por favor, seleccione una fecha y hora.');
        return false;
    }
    return true;
}

function updatePetDetails() {
    const petSelect = document.getElementById('pet-select');
    const selectedOption = petSelect.options[petSelect.selectedIndex];

    const petName = selectedOption.getAttribute('data-name');
    const petAge = selectedOption.getAttribute('data-age');
    const petBreed = selectedOption.getAttribute('data-breed');
    const petImage = selectedOption.getAttribute('data-image');

    if (petName && petAge && petBreed && petImage) {
        document.getElementById('pet-name').innerText = petName;
        document.getElementById('pet-age').innerText = `Edad: ${petAge} años`;
        document.getElementById('pet-breed').innerText = `Raza: ${petBreed}`;
        document.getElementById('pet-image').src = petImage;
        document.getElementById('pet-card').classList.remove('hidden');
    } else {
        document.getElementById('pet-card').classList.add('hidden');
    }
}

function goToStep(stepId, iconId) {
    // Add logic to return to the previous step
    const currentStepId = document.querySelector('.step-content:not(.hidden)').id;
    if (stepId !== currentStepId) {
        document.getElementById(currentStepId).classList.add('hidden');
        document.getElementById(stepId).classList.remove('hidden');
        document.getElementById(iconId).classList.add('text-green-500');
    }
}

// Función para confirmar la cita y mostrar la fase de éxito
function confirmAppointment() {
const appointmentDetails = document.getElementById('appointment-details').value;
if (!appointmentDetails) {
    alert('Por favor, complete los detalles de la cita.');
    return;
}

// Obtener los detalles de la cita
const selectedDate = document.getElementById('date-select').value;
const selectedTime = document.getElementById('selected-time').value;
const doctorName = document.getElementById('doctor-name').innerText;
const petName = document.getElementById('pet-name').innerText;

console.log(`Fecha: ${selectedDate}`);
console.log(`Hora: ${selectedTime}`);
console.log(`Doctor: ${doctorName}`);
console.log(`Mascota: ${petName}`);

// Actualizar la tarjeta de resumen de cita
document.getElementById('summary-date').innerText = `Fecha: ${selectedDate}`;
document.getElementById('summary-time').innerText = `Hora: ${selectedTime}`;
document.getElementById('summary-doctor').innerText = `Doctor: ${doctorName}`;
document.getElementById('summary-pet').innerText = `Mascota: ${petName}`;
document.getElementById('summary-address').innerText = 'Domicilio: [Dirección del domicilio]'; // Puedes ajustar esto si es dinámico

// Actualiza la fase actual y muestra la fase de éxito
goToStep('step-success', 'success-icon');
}