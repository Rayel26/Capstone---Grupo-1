
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

///Datos simulados
// Datos de ejemplo de usuarios registrados
const registeredUsers = {
    '12.345.678-9': { name: 'Juan Pérez', address: 'Calle Ejemplo 123', phone: '+56 9 1234 5678' },
    '98.765.432-1': { name: 'María González', address: 'Avenida Test 456', phone: '+56 9 8765 4321' },
};

// Función para actualizar la tarjeta de usuario
function updateUserCard(rut) {
    const user = registeredUsers[rut];
    const userCard = document.getElementById('user-card');

    if (user) {
        // Mostrar información del usuario en la tarjeta
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-address').textContent = ` ${user.address}`;
        document.getElementById('user-phone').textContent = `${user.phone}`;
        
        // Mostrar la tarjeta
        userCard.classList.remove('hidden');
    } else {
        userCard.classList.add('hidden'); // Oculta la tarjeta si el RUT no está registrado
    }
}

// Evento del botón para continuar
const button = document.querySelector('button'); // Asegúrate de que seleccione el botón correcto
button.onclick = function() {
    const rut = document.getElementById('rut-input').value;

    // Verificar si el RUT está registrado
    if (!registeredUsers[rut]) {
        alert('Este RUT no está registrado. Por favor, regístrese primero.');
        return; // No continuar si no está registrado
    }
    
    if (!isValidRut(rut)) {
        alert('Por favor, ingrese un RUT válido en el formato xx.xxx.xxx-x.');
        return;
    }

    // Actualizar la tarjeta del usuario
    updateUserCard(rut);
    
    // Lógica para continuar al siguiente paso
    nextStep('step-id', 'step-search', 'id-icon');
};
/// Fin Datos simulados

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

// Muestra precio por servicio
function updateServiceValue() {
    const serviceSelect = document.getElementById('service-select');
    const serviceValueDisplay = document.getElementById('service-value-display');

    // Obtener la opción seleccionada
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];

    // Verificar si hay un valor seleccionado
    if (selectedOption && selectedOption.getAttribute('data-price')) {
        const price = selectedOption.getAttribute('data-price');
        serviceValueDisplay.textContent = "Precio: $" + formatCurrency(price) + " CLP";
    } else {
        serviceValueDisplay.textContent = "Seleccione un servicio para ver el precio.";
    }
}

// Función auxiliar para formatear números como moneda
function formatCurrency(value) {
    return parseInt(value).toLocaleString('es-CL');
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

///Manejo de calendario

        // Obtener la fecha de hoy
        const today = new Date();
        const holidays = [
            '2024-01-01', // Año Nuevo
            '2024-03-29', // Viernes Santo
            '2024-04-01', // Sábado de Gloria
            '2024-05-01', // Día del Trabajo
            '2024-05-21', // Día de las Glorias Navales
            '2024-06-26', // San Pedro y San Pablo
            '2024-07-16', // Virgen del Carmen
            '2024-08-15', // Asunción de la Virgen
            '2024-09-18', // Independencia de Chile
            '2024-09-19', // Día de las Glorias del Ejército
            '2024-10-31', // Día de la Unidad Nacional
            '2024-11-01', // Día de Todos los Santos
            '2024-12-08', // Inmaculada Concepción
            '2024-12-25', // Navidad
        ];
        
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let previousMonth = null; // Para almacenar el mes anterior
        let monthStack = []; // Para almacenar la pila de meses visitados

        // Función para crear el calendario
        function createCalendar() {
            const calendarContainer = document.getElementById('calendar');
            const monthNameElement = document.getElementById('month-name');
            calendarContainer.innerHTML = ''; // Limpiar el calendario

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
                    dayElement.addEventListener('click', function() {
                        document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
                        dayElement.classList.add('selected');
                        document.getElementById('date-select').value = dateString; // Guardar la fecha seleccionada
                    });
                }

                calendarContainer.appendChild(dayElement);
            }
        }

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

        // Botón de mes anterior (regresar al mes actual)
        document.getElementById('prev-month').addEventListener('click', function() {
            // Regresar al mes actual (el que se guardó en el historial)
            if (previousMonth !== null) {
                currentMonth = previousMonth;
                currentYear = today.getFullYear(); // Mantener el año actual
                createCalendar();
            }
        });

        createCalendar(); // Llamar a la función para crear el calendario inicial

        function validateDateTime() {
            // Lógica para validar la fecha y hora
            // Asegúrate de que retorne true si todo es correcto
            return true; // Cambia esto según tu lógica de validación
        }
///Fin calendario

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
            'px-3', // Reducir padding horizontal
            'py-1', // Reducir padding vertical
            'bg-[#18beaa]',
            'hover:bg-[#16a89a]',
            'text-white',
            'font-semibold',
            'rounded-lg',
            'shadow-md',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-green-400',
            'focus:ring-opacity-75',
            'transition',
            'duration-300',
            'ease-in-out',
            'transition-transform',
            'transform-gpu',
            'hover:-translate-y-1',
            'hover:shadow-lg',
            'cursor-pointer'
        );
        button.dataset.time = formattedTime; // Almacenar el tiempo en el atributo data

        // Manejar el evento de clic
        button.onclick = () => {
            document.getElementById('selected-time').value = formattedTime;
            // Aquí puedes agregar una lógica para marcar el botón seleccionado, si es necesario
            console.log(`Hora seleccionada: ${formattedTime}`); // Ver en la consola
        };

        timeSelect.appendChild(button); // Agregar el botón al contenedor
    }
}

// Llamar a la función para generar los botones cuando se cargue el documento
document.addEventListener('DOMContentLoaded', generateTimeButtons);
/// Fin Función para generar los botones de hora


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

// Función para ir a un paso específico
function goToStep(stepId, iconId) {
    const currentStepId = document.querySelector('.step-content:not(.hidden)').id;
    if (stepId !== currentStepId) {
        document.getElementById(currentStepId).classList.add('hidden');
        document.getElementById(stepId).classList.remove('hidden');
        updateStepIcons(iconId, 'next'); // Asegurarse de que los íconos se actualicen
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
