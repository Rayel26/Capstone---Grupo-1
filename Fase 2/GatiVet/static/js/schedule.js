// Función para cambiar de paso
function nextStep(currentStep, nextStep, currentIcon) {
    const rutInput = document.getElementById('rut-input').value;

    // Validar RUT solo si se está avanzando al siguiente paso
    if (nextStep !== 'step-success' && !isValidRut(rutInput)) {
        alert('Por favor, ingrese un RUT válido en el formato correcto (XX.XXX.XXX-X).');
        return; // No cambiar de paso si el RUT no es válido
    }

    document.getElementById(currentStep).classList.add('hidden');
    document.getElementById(nextStep).classList.remove('hidden');

    updateStepIcons(currentIcon, 'next'); // Actualizar los íconos
}

// Función para regresar a un paso anterior
function prevStep(currentStep, prevStep, currentIcon) {
    document.getElementById(currentStep).classList.add('hidden');
    document.getElementById(prevStep).classList.remove('hidden');

    updateStepIcons(currentIcon, 'prev'); // Actualizar los íconos
}

// Función para manejar el clic en los íconos de los pasos
function handleStepClick(stepId, iconId) {
    const rutInput = document.getElementById('rut-input').value;

    // Comprobar si el RUT es válido antes de permitir el cambio de paso
    if (stepId !== 'step-id' && !isValidRut(rutInput)) {
        alert('Por favor, ingrese un RUT válido antes de avanzar a este paso.');
        return;
    }

    // Validación de campos de selección de servicio, área y doctor
    const serviceSelected = document.getElementById('service-select').value;
    const doctorSelected = document.getElementById('staff-select').value;
    if (doctorSelected === '' || serviceSelected === '') {
        alert('Por favor, complete todos los campos del servicio antes de continuar.');
        return;
    }

    // Validación de fecha y hora
    const selectedDate = document.getElementById('date-select').value;
    const selectedTime = document.getElementById('selected-time').value;
    if (selectedDate === '' || selectedTime === '') {
        alert('Por favor, seleccione una fecha y una hora para continuar.');
        return;
    }

    // Validación de mascota seleccionada
    const selectedPet = document.getElementById('pet-select').value;
    if (!selectedPet) {
        alert('Por favor, seleccione una mascota.');
        return;
    }

    // Validación de detalles de la cita
    const appointmentDetails = document.getElementById('appointment-details').value;
    if (!appointmentDetails) {
        alert('Por favor, complete los detalles de la cita.');
        return;
    }

    // Si todas las validaciones pasan, cambiar de paso
    goToStep(stepId, iconId);
}


// Actualizar íconos según el paso actual
function updateStepIcons(currentIcon, direction) {
    const stepIcons = document.querySelectorAll('.step-icon');

    // Marcar todos los íconos como inactivos
    stepIcons.forEach(icon => icon.classList.remove('step-icon-active'));

    if (direction === 'next') {
        // Activar el ícono actual y los anteriores
        const currentIndex = Array.from(stepIcons).findIndex(icon => icon.id === currentIcon);
        for (let i = 0; i <= currentIndex; i++) {
            stepIcons[i].classList.add('step-icon-active');
        }
    } else if (direction === 'prev') {
        // Activar el ícono actual y los anteriores
        const currentIndex = Array.from(stepIcons).findIndex(icon => icon.id === currentIcon);
        for (let i = 0; i < currentIndex; i++) {
            stepIcons[i].classList.add('step-icon-active');
        }
        stepIcons[currentIndex].classList.add('step-icon-active'); // Activar el ícono actual
    }
}

// Validar RUT
function isValidRut(rut) {
    const rutPattern = /^\d{1,2}\.\d{3}\.\d{3}-[\dKk]$/;
    return rutPattern.test(rut);
}

// Formatear RUT (solo para la interfaz de usuario)
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

async function updateUserCard(id_usuario) {
    const userCard = document.getElementById('user-card');

    try {
        // Realizar una solicitud GET al endpoint de Flask con el id_usuario proporcionado
        const response = await fetch(`/api/get_user_by_id?id_usuario=${encodeURIComponent(id_usuario)}`);

        if (response.ok) {
            const user = await response.json();
            
            // Actualizar la tarjeta de usuario con los datos obtenidos
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-address').textContent = user.address;
            document.getElementById('user-phone').textContent = user.phone;

            // Mostrar la tarjeta
            userCard.classList.remove('hidden');
        } else {
            // Ocultar la tarjeta si el id_usuario no está registrado
            userCard.classList.add('hidden');
            alert('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        alert('Ocurrió un error al buscar el usuario');
    }
}

// Evento del botón para continuar
const button = document.querySelector('button');

button.onclick = async function() {
    let rut = document.getElementById('rut-input').value;

    // Verificar si el RUT tiene un formato válido
    if (!isValidRut(rut)) {
        alert('Por favor, ingrese un RUT válido en el formato xx.xxx.xxx-x.');
        return;
    }

    // Usar el RUT tal cual está (sin normalizar)
    const id_usuario = rut; // El RUT con los puntos y guion

    // Actualizar la tarjeta del usuario llamando al backend para obtener los datos
    await updateUserCard(id_usuario);
    
    // Cargar las mascotas del usuario
    await loadPets(id_usuario); // Llama a la función de cargar mascotas con el ID normalizado
    
    // Lógica para continuar al siguiente paso
    nextStep('step-id', 'step-search', 'id-icon');
};



//Funcion para llamar a los doctores en agenda
function loadDoctors() {
    fetch('/api/get_doctors')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(doctors => {
            const staffSelect = document.getElementById('staff-select');
            staffSelect.innerHTML = ''; // Limpiar opciones existentes

            const defaultOption = document.createElement('option');
            defaultOption.value = 'none';
            defaultOption.textContent = 'Seleccione un doctor';
            staffSelect.appendChild(defaultOption);

            doctors.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.value; // id_usuario
                option.textContent = doctor.name; // Dr. nombre completo
                option.setAttribute('data-name', doctor.name);
                option.setAttribute('data-image', doctor.image);
                staffSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar los doctores:', error);
            alert('Ocurrió un error al obtener los doctores. Intente nuevamente.');
        });
}

// Llamar ambas funciones al cargar la página
window.onload = function() {
    loadDoctors();   // Llamar a la función loadDoctors
    cargarServicios();  // Llamar a la función cargarServicios
};



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

// Función para cargar los servicios desde el backend
async function cargarServicios() {
    try {
        const response = await fetch('/obtener_servicios');
        const servicios = await response.json();

        const select = document.getElementById('service-select');
        servicios.forEach(servicio => {
            const option = document.createElement('option');
            option.value = servicio.descripcion;
            option.textContent = servicio.descripcion;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar los servicios:', error);
    }
}

// Establecer la hora seleccionada
document.querySelectorAll('#time-select button').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('selected-time').value = this.getAttribute('data-time');
    });
});

// Obtener los días festivos de Chile para un año específico
function getHolidays(year) {
    return [
        `${year}-01-01`, // Año Nuevo
        `${year}-03-29`, // Viernes Santo (aproximado)
        `${year}-03-30`, // Sábado de Gloria (aproximado)
        `${year}-05-01`, // Día del Trabajo
        `${year}-05-21`, // Día de las Glorias Navales
        `${year}-06-29`, // San Pedro y San Pablo (aproximado)
        `${year}-07-16`, // Virgen del Carmen
        `${year}-08-15`, // Asunción de la Virgen
        `${year}-09-18`, // Independencia de Chile
        `${year}-09-19`, // Día de las Glorias del Ejército
        `${year}-10-31`, // Día de la Unidad Nacional
        `${year}-11-01`, // Día de Todos los Santos
        `${year}-12-08`, // Inmaculada Concepción
        `${year}-12-25`  // Navidad
    ];
}

// Obtener la fecha de hoy
const today = new Date();
today.setHours(0, 0, 0, 0); // Asegurarse de que se comparen solo las fechas

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let monthStack = []; // Para almacenar la pila de meses visitados

// Crear el calendario
function createCalendar() {
    const calendarContainer = document.getElementById('calendar');
    const monthNameElement = document.getElementById('month-name');
    calendarContainer.innerHTML = ''; // Limpiar el calendario

    // Obtener los días festivos del año actual
    const holidays = getHolidays(currentYear);

    // Establecer el nombre del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    monthNameElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Agregar los nombres de los días
    const daysNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    daysNames.forEach(day => {
        const dayNameElement = document.createElement('div');
        dayNameElement.classList.add('day');
        dayNameElement.textContent = day;
        calendarContainer.appendChild(dayNameElement);
    });

    // Establecer la fecha actual
    const currentDate = new Date(currentYear, currentMonth, 1);
    const firstDayIndex = currentDate.getDay(); // 0 es domingo, 6 es sábado
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Agregar espacios vacíos para los días anteriores al primer día del mes
    for (let i = 0; i < firstDayIndex; i++) {
        calendarContainer.appendChild(document.createElement('div'));
    }

    // Agregar los días del mes
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        dayElement.textContent = i;

        // Crear fecha para comparación
        const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayDate = new Date(currentYear, currentMonth, i);

        // Resaltar el día actual
        if (i === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayElement.classList.add('today');
        }

        // Deshabilitar sábados, domingos y festivos
        const dayOfWeek = (firstDayIndex + i - 1) % 7; // Calcular el día de la semana
        if (dayOfWeek === 0 || dayOfWeek === 6 || holidays.includes(dateString)) {
            if (holidays.includes(dateString)) {
                dayElement.classList.add('holiday'); // Agregar clase de día festivo
            } else {
                dayElement.classList.add('weekend'); // Agregar clase de fin de semana
            }
        } else {
            // Deshabilitar días anteriores a la fecha actual
            if (dayDate < today) {
                dayElement.classList.add('disabled'); // Agregar clase de deshabilitado
                dayElement.style.color = 'grey'; // Cambiar color a gris para fechas deshabilitadas
                dayElement.style.pointerEvents = 'none'; // Evitar la interacción con el mouse
            } else {
                // Permitir seleccionar días futuros
                dayElement.addEventListener('click', function() {
                    document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
                    dayElement.classList.add('selected');
                    document.getElementById('date-select').value = dateString; // Guardar la fecha seleccionada
                });
            }
        }

        calendarContainer.appendChild(dayElement);
    }

    // Llamar a la función para verificar si los días están ocupados y marcar los días ocupados
    checkAllDaysOccupied();
}

// Función para marcar los días como completamente ocupados si todas sus horas están tomadas
function checkAllDaysOccupied() {
    document.querySelectorAll('.day').forEach(dayElement => {
        const selectedDate = dayElement.textContent;
        const selectedDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        fetch('/api/check_availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: selectedDateString })
        })
        .then(response => response.json())
        .then(data => {
            const occupiedHours = data.occupied_hours.map(normalizeTime); // Normalizar horas ocupadas

            // Comprobar si todas las horas están ocupadas
            const allHoursOccupied = occupiedHours.length === document.querySelectorAll('.time-button').length;
            if (allHoursOccupied) {
                dayElement.classList.add('fully-booked');
                dayElement.style.backgroundColor = 'red'; // Cambiar color a rojo
                dayElement.style.pointerEvents = 'none'; // Deshabilitar la selección de este día
            } else {
                dayElement.classList.remove('fully-booked');
                dayElement.style.backgroundColor = ''; // Restaurar color si no está ocupado
                dayElement.style.pointerEvents = ''; // Habilitar la selección si no está ocupado
            }
        })
        .catch(err => {
            console.error('Error al verificar disponibilidad para el día:', err);
        });
    });
}

// Llamar a la función para crear el calendario inicial
createCalendar();



// Botón de mes siguiente
document.getElementById('next-month').addEventListener('click', function() {
    previousMonth = currentMonth; // Guardar el mes anterior
    monthStack.push({ month: currentMonth, year: currentYear }); // Almacenar el mes en la pila
    if (currentMonth === 11) { // Si es diciembre
        currentMonth = 0; // Regresar a enero
        currentYear++; // Aumentar el año
    } else {
        currentMonth++; // Avanzar al siguiente mes
    }
    createCalendar();
});

// Botón de mes anterior (regresar al mes guardado en la pila)
document.getElementById('prev-month').addEventListener('click', function() {
    if (monthStack.length > 0) {
        const previousState = monthStack.pop(); // Recuperar el último estado en la pila
        currentMonth = previousState.month;
        currentYear = previousState.year; // Mantener el año guardado en el historial
        createCalendar();
    } else {
        if (currentMonth === 0) { // Si es enero
            currentMonth = 11; // Regresar a diciembre
            currentYear--; // Disminuir el año
        } else {
            currentMonth--; // Retroceder al mes anterior
        }
        createCalendar();
    }
});


// Función para validar selección de fecha y hora
function validateDateTime() {
    const selectedDate = document.getElementById('date-select').value;
    const selectedTime = document.getElementById('selected-time').value;

    if (selectedDate === '' || selectedTime === '') {
        alert('Por favor, seleccione una fecha y una hora para continuar.');
        return false;
    }
    return true;
}

/// Función para generar los botones de hora
function generateTimeButtons() {
    const timeSelect = document.getElementById('time-select');
    timeSelect.innerHTML = ''; // Limpiar contenido previo

    // Horario de inicio y fin
    const startTime = new Date();
    startTime.setHours(8);
    startTime.setMinutes(30);
    
    const endTime = new Date();
    endTime.setHours(17);
    endTime.setMinutes(30);

    // Crear botones de hora
    for (let time = startTime; time <= endTime; time.setHours(time.getHours() + 2)) { // Incrementar cada 2 horas
        const button = document.createElement('button');
        const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        button.innerText = formattedTime;

        // Agregar clases para estilo de los botones
        button.classList.add(
            'time-button',
            'px-3', 'py-1', 'bg-[#18beaa]', 'hover:bg-[#16a89a]',
            'text-white', 'font-semibold', 'rounded-lg', 'shadow-md',
            'focus:outline-none', 'focus:ring-2', 'focus:ring-green-400',
            'focus:ring-opacity-75', 'transition', 'duration-300',
            'ease-in-out', 'transition-transform', 'transform-gpu',
            'hover:-translate-y-1', 'hover:shadow-lg', 'cursor-pointer'
        );
        button.dataset.time = formattedTime; // Almacenar el tiempo en el atributo data

        // Manejar el evento de clic
        button.onclick = () => {
            document.getElementById('selected-time').value = formattedTime;
            // Aquí puedes agregar una lógica para marcar el botón seleccionado
            console.log(`Hora seleccionada: ${formattedTime}`);
        };

        timeSelect.appendChild(button); // Agregar el botón al contenedor
    }
}

// Normalizar las horas al formato 'HH:MM' antes de comparar
const normalizeTime = (time) => time.substring(0, 5); // Eliminar los segundos



// Event listener para el clic de los días seleccionados
document.querySelectorAll('.day').forEach(dayElement => {
    dayElement.addEventListener('click', function() {
        const selectedDate = dayElement.textContent;
        const selectedDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        console.log("Día seleccionado:", selectedDateString);  // Depuración: mostrar el día seleccionado

        // Obtener la fecha actual
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'

        // Comprobar si la fecha seleccionada es anterior a la fecha actual
        if (selectedDateString < todayString) {
            console.log("No se puede seleccionar una fecha anterior a hoy.");
            return; // Salir de la función si la fecha es anterior
        }

        // Si la fecha no es anterior a hoy, hacer la consulta
        fetch('/api/check_availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ date: selectedDateString })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Horas ocupadas para el día seleccionado:", data.occupied_hours); // Depuración: mostrar las horas ocupadas

            const occupiedHours = data.occupied_hours.map(normalizeTime); // Normalizar horas ocupadas

            document.querySelectorAll('.time-button').forEach(button => {
                const buttonTime = normalizeTime(button.dataset.time); // Normalizar la hora del botón

                console.log("Hora del botón:", buttonTime);  // Depuración

                if (occupiedHours.includes(buttonTime)) {
                    button.disabled = true;
                    button.classList.add('disabled');
                    console.log(`Hora ocupada: ${buttonTime}`);  // Depuración
                } else {
                    button.disabled = false;
                    button.classList.remove('disabled');
                }
            });

            const allHoursOccupied = occupiedHours.length === document.querySelectorAll('.time-button').length;
            if (allHoursOccupied) {
                dayElement.classList.add('fully-booked');
                dayElement.style.backgroundColor = 'red';
                console.log("El día está completamente ocupado");  // Depuración
            } else {
                dayElement.classList.remove('fully-booked');
                dayElement.style.backgroundColor = '';
            }

            dayElement.classList.add('selected');
            document.getElementById('date-select').value = selectedDateString;
        })
        .catch(err => {
            console.error('Error fetching availability:', err); // Mostrar errores si hay algún problema
        });
    });
});



// Llamar a la función para generar los botones cuando se cargue el documento
document.addEventListener('DOMContentLoaded', generateTimeButtons);
/// Fin Función para generar los botones de hora


// Función para cargar las mascotas del usuario
async function loadPets(id_usuario) {
    const response = await fetch(`/api/get_pets_by_user_id?id_usuario=${id_usuario}`);
    
    if (response.ok) {
        const pets = await response.json();
        const petSelect = document.getElementById('pet-select');

        // Limpiar opciones existentes
        petSelect.innerHTML = '<option value="">Seleccione una mascota</option>';

        // Agregar las mascotas al selector
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id_mascota; // Asegúrate de que sea el ID correcto
            option.setAttribute('data-name', pet.nombre);
            option.setAttribute('data-age', pet.edad);
            option.setAttribute('data-breed', pet.raza);
            option.setAttribute('data-image', pet.foto_url);
            option.textContent = pet.nombre; // Mostrar el nombre de la mascota
            petSelect.appendChild(option);
        });
    } else {
        console.error('Error al cargar las mascotas:', response.statusText);
    }
}


// Actualiza detalles de la mascota cuando se selecciona
document.getElementById('pet-select').addEventListener('change', updatePetDetails);

function updatePetDetails() {
    const select = document.getElementById('pet-select');
    const selectedOption = select.options[select.selectedIndex];

    const petCard = document.getElementById('pet-card');
    const petName = document.getElementById('pet-name');
    const petAge = document.getElementById('pet-age');
    const petBreed = document.getElementById('pet-breed');
    const petImage = document.getElementById('pet-image');

    // Actualiza los detalles de la mascota
    if (selectedOption.value) {
        petName.textContent = selectedOption.getAttribute('data-name');
        petAge.innerHTML = `<strong>Edad:</strong> <span class="text-[#18beaa]">${selectedOption.getAttribute('data-age')} años</span>`;
        petBreed.innerHTML = `<strong>Raza:</strong> <span class="text-[#18beaa]">${selectedOption.getAttribute('data-breed')}</span>`;
        petImage.src = selectedOption.getAttribute('data-image');
        petCard.classList.remove('hidden'); // Mostrar la tarjeta de detalles
    } else {
        petCard.classList.add('hidden'); // Ocultar la tarjeta si no se selecciona ninguna mascota
    }
}


// Función para ir a un paso específico
function goToStep(stepId, iconId) {
    const currentStepId = document.querySelector('.step-content:not(.hidden)').id;
    if (stepId !== currentStepId) {
        document.getElementById(currentStepId).classList.add('hidden');
        document.getElementById(stepId).classList.remove('hidden');
        updateStepIcons(iconId, 'next'); // Asegurarse de que los íconos se actualicen
    }
}

async function confirmAppointment() {
    // Mostrar el spinner de carga
    document.getElementById('loading-spinner').classList.remove('hidden');

    // Validar que se ha seleccionado una mascota
    const selectedPet = document.getElementById('pet-select').value;
    if (!selectedPet) {
        alert('Por favor, seleccione una mascota.');
        document.getElementById('loading-spinner').classList.add('hidden');
        return;
    }

    // Validar que se han completado los detalles de la cita
    const appointmentDetails = document.getElementById('appointment-details').value;
    if (!appointmentDetails) {
        alert('Por favor, complete los detalles de la cita.');
        document.getElementById('loading-spinner').classList.add('hidden');
        return;
    }

    // Obtener los detalles de la cita
    const selectedDate = document.getElementById('date-select').value;
    const selectedTime = document.getElementById('selected-time').value;
    if (!selectedTime) {
        alert('Por favor, seleccione una hora.');
        document.getElementById('loading-spinner').classList.add('hidden');
        return;
    }

    // Función para convertir la hora a formato de 24 horas
    function convertTo24HourFormat(timeString) {
        const [time, modifier] = timeString.split(" ");
        let [hours, minutes] = time.split(":");
        if (modifier === "p. m." && hours !== "12") {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === "a. m." && hours === "12") {
            hours = "00";
        }
        return `${hours}:${minutes}`;
    }

    const formattedTime = convertTo24HourFormat(selectedTime);
    const doctorId = document.getElementById('staff-select').value;
    const service = document.getElementById('service-select').value;
    const rut = document.getElementById('rut-input').value;

    // Enviar la información a la ruta de Flask
    try {
        const response = await fetch('/api/confirm_appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rut: rut,
                doctorId: doctorId,
                service: service,
                date: selectedDate,
                time: formattedTime,
                petId: selectedPet,
                details: appointmentDetails
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Error al confirmar la cita: ${errorText}`);
            document.getElementById('loading-spinner').classList.add('hidden');
            return;
        }

        const result = await response.json();

        // Actualizar la tarjeta de resumen de cita
        document.getElementById('summary-date').innerHTML = `<strong class="font-bold">Fecha:</strong> <span class="text-gray-700">${selectedDate}</span>`;
        document.getElementById('summary-time').innerHTML = `<strong class="font-bold">Hora:</strong> <span class="text-gray-700">${formattedTime}</span>`;
        document.getElementById('summary-doctor').innerHTML = `<strong class="font-bold">Doctor:</strong> <span class="text-gray-700">${result.doctorName}</span>`;
        document.getElementById('summary-pet').innerHTML = `<strong class="font-bold">Mascota:</strong> <span class="text-gray-700">${result.petName}</span>`;
        document.getElementById('summary-address').innerHTML = `<strong class="font-bold">Domicilio:</strong> <span class="text-gray-700">${result.userAddress}</span>`;

        // Mostrar la tarjeta de éxito
        goToStep('step-success', 'success-icon');

    } catch (error) {
        console.error('Error al enviar la cita:', error);
        alert('Ocurrió un error al confirmar la cita.');
    } finally {
        // Ocultar el spinner de carga
        document.getElementById('loading-spinner').classList.add('hidden');
    }
}
