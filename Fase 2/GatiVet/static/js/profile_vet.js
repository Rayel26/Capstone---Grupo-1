// Función para formatear el RUT automáticamente mientras se escribe
function formatRut(value) {
    value = value.replace(/[^0-9kK]/g, '');
    if (value.length > 9) {
        value = value.slice(0, 9);
    }
    if (value.length > 1) {
        let body = value.slice(0, -1);
        let verifier = value.slice(-1);
        body = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `${body}-${verifier}`;
    }
    return value;
}

// Función para mostrar el modal con la descripción completa
function openModal(descriptionId) {
    const descriptions = {
        'descripcion1': 'En caso de una investigación por parte de cualquier entidad federal o similar, no tengo ninguna participación con este grupo ni con las personas que lo integran, no sé cómo estoy aquí, probablemente agregado por un tercero, no apoyo ninguna acción por parte de los miembros de este grupo.',
        'descripcion2': 'Limpieza dental y revisión de encías. Se realizó una limpieza exhaustiva...'
    };

    document.getElementById('modal-description').textContent = descriptions[descriptionId];
    document.getElementById('modal').classList.remove('hidden');
}

// Función para cerrar el modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Manejo del modal
document.getElementById('modal-close-btn').addEventListener('click', closeModal);

// Configuración de paginación
const rowsPerPage = 5;
let currentPage = 1;

function paginateTable(tableId) {
    const table = document.querySelector(`#${tableId}`);
    const rows = table.querySelectorAll('tbody tr');
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    function showPage(page) {
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;

        rows.forEach((row, index) => {
            row.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
        });
    }

    function createPaginationControls() {
        const pagination = document.querySelector(`#procedimientos-pagination`);
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.classList.add('pagination-button');
            button.disabled = (i === currentPage);
            button.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updatePaginationControls();
            });
            pagination.appendChild(button);
        }
    }

    function updatePaginationControls() {
        const buttons = document.querySelectorAll(`#procedimientos-pagination .pagination-button`);
        buttons.forEach(button => button.disabled = false);
        buttons[currentPage - 1].disabled = true;
    }

    showPage(currentPage);
    createPaginationControls();
}

// Función para mostrar los procedimientos
function showProcedures(selectedPet) {
    const procedureTableBody = document.querySelector('#procedure-table tbody');
    procedureTableBody.innerHTML = ''; // Limpiar historial anterior

    selectedPet.procedures.forEach((procedure, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${procedure.type}</td>
            <td>${procedure.date}</td>
            <td>${procedure.vet}</td>
            <td>
                <span class="truncate w-48 cursor-pointer" onclick="openModal('descripcion${index}')">${procedure.description}</span>
            </td>
        `;
        procedureTableBody.appendChild(row);
    });

    // Paginación después de llenar la tabla
    paginateTable('procedure-table');
}

// Llama a showProcedures cuando selecciones una mascota
function showPetDetails() {
    const selectedPetId = document.getElementById('pet-selection').value;
    const selectedPet = window.petsData.find(pet => pet.id == selectedPetId);

    if (selectedPet) {
        document.getElementById('pet-name').textContent = selectedPet.name;
        document.getElementById('pet-breed').textContent = selectedPet.breed;
        document.getElementById('pet-age').textContent = selectedPet.age;
        document.getElementById('pet-sterilized').textContent = selectedPet.sterilized;
        document.getElementById('pet-chip').textContent = selectedPet.chip;

        // Mostrar los procedimientos
        showProcedures(selectedPet);

        // Mostrar la sección de detalles de la mascota
        document.getElementById('pet-details').classList.remove('hidden');
    }
}

// Datos de dueños aleatorios
const owners = [
    {
        name: 'Carlos López',
        age: 42,
        address: 'Los Robles 456',
        pets: [
            {
                id: 1,
                name: 'Firulais',
                breed: 'Labrador',
                age: 5,
                sterilized: 'Sí',
                chip: '1234567890',
                procedures: [
                    { type: 'Vacuna antirrábica', date: '2023-06-01', vet: 'Dr. Pérez', description: 'Vacuna contra la rabia', descriptionId: 'descripcion1' },
                    { type: 'Desparasitación', date: '2023-07-15', vet: 'Dra. González', description: 'Desparasitante oral', descriptionId: 'descripcion2'   },
                    { type: 'Cirugía', date: '2023-08-20', vet: 'Dr. López', description: 'Cirugía de urgencia', descriptionId: 'descripcion2'  },
                    { type: 'Cirugía', date: '2023-08-20', vet: 'Dr. López', description: 'Cirugía de urgencia', descriptionId: 'descripcion2'  },
                    { type: 'Cirugía', date: '2023-08-20', vet: 'Dr. López', description: 'Cirugía de urgencia', descriptionId: 'descripcion2'  },
                    { type: 'Cirugía', date: '2023-08-20', vet: 'Dr. López', description: 'Cirugía de urgencia', descriptionId: 'descripcion2'  },
                    { type: 'Cirugía', date: '2023-08-20', vet: 'Dr. López', description: 'Cirugía de urgencia', descriptionId: 'descripcion1'  }
                ]
            },
            {
                id: 2,
                name: 'Michi',
                breed: 'Gato Siamés',
                age: 3,
                sterilized: 'No',
                chip: '9876543210',
                procedures: [
                    { type: 'Vacuna triple felina', date: '2023-05-10', vet: 'Dra. Fernández', description: 'Vacuna de virus felinos' },
                    { type: 'Limpieza dental', date: '2023-08-05', vet: 'Dr. Martínez', description: 'Limpieza dental completa' }
                ]
            },
            {
                id: 3,
                name: 'Pelusa',
                breed: 'Persa',
                age: 4,
                sterilized: 'Sí',
                chip: '1122334455',
                procedures: [] // Nueva mascota sin procedimientos
            }
        ]
    }
];

// Función para buscar el dueño por RUT
function searchOwner() {
    const rut = document.getElementById('rut').value;

    // Comprobar si el RUT es válido
    const cleanRut = rut.replace(/\D/g, ''); // Elimina caracteres no numéricos
    if (cleanRut.length !== 9) { // Asegúrate de que el RUT completo (8 dígitos + dígito verificador) se ha ingresado
        const rutErrorMessage = document.getElementById('rut-error-message');
        rutErrorMessage.textContent = 'Por favor, ingrese un RUT completo y válido.';
        rutErrorMessage.classList.remove('hidden'); // Muestra el mensaje
        return; // Salir de la función si el RUT no es válido
    } else {
        document.getElementById('rut-error-message').classList.add('hidden'); // Oculta el mensaje si el formato es válido
    }

    const ownerData = owners[Math.floor(Math.random() * owners.length)];

    document.getElementById('owner-name').textContent = ownerData.name;
    document.getElementById('owner-age').textContent = ownerData.age;
    document.getElementById('owner-address').textContent = ownerData.address;
    document.getElementById('owner-profile').classList.remove('hidden');

    const petSelection = document.getElementById('pet-selection');
    petSelection.innerHTML = ''; // Limpiar opciones anteriores
    ownerData.pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.id;
        option.textContent = `${pet.name} - ${pet.breed}`;
        petSelection.appendChild(option);
    });

    // Guardar los datos de las mascotas para su uso posterior
    window.petsData = ownerData.pets;
}

// Función para mostrar más detalles de la mascota seleccionada
function showPetDetails() {
    const selectedPetId = document.getElementById('pet-selection').value;
    const selectedPet = window.petsData.find(pet => pet.id == selectedPetId);

    if (selectedPet) {
        document.getElementById('pet-name').textContent = selectedPet.name;
        document.getElementById('pet-breed').textContent = selectedPet.breed;
        document.getElementById('pet-age').textContent = selectedPet.age;
        document.getElementById('pet-sterilized').textContent = selectedPet.sterilized;
        document.getElementById('pet-chip').textContent = selectedPet.chip;

        // Llenar el historial de procedimientos en una tabla
        const procedureTableBody = document.getElementById('procedure-history');
        procedureTableBody.innerHTML = ''; // Limpiar historial anterior

        if (selectedPet.procedures.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No hay procedimientos registrados.';
            row.appendChild(cell);
            procedureTableBody.appendChild(row);
        } else {
            selectedPet.procedures.forEach(procedure => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${procedure.type}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${procedure.date}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${procedure.vet}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="truncate w-48 cursor-pointer" onclick="openModal('${procedure.descriptionId}')">
                            ${procedure.description}
                        </span>
                    </td>
                `;
                procedureTableBody.appendChild(row);
            });
        }

        // Llamar a la función de paginación después de llenar la tabla
        paginateTable('procedure-history', rowsPerPage);
        
        // Mostrar la sección de detalles de la mascota
        document.getElementById('pet-details').classList.remove('hidden');
    }
}

// Función para mostrar la sección de contenido seleccionada
function showContent(sectionId) {
    // Oculta todos los contenidos primero
    const sections = document.querySelectorAll('#main-content > div');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Muestra la sección correspondiente
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
    }
}

// Ejecución cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const rutInput = document.getElementById('rut');

    rutInput.addEventListener('input', () => {
        const formattedRut = formatRut(rutInput.value);
        rutInput.value = formattedRut;
    });

    document.getElementById('search-owner-btn').addEventListener('click', function () {
        searchOwner();
    });

    document.getElementById('pet-selection').addEventListener('change', showPetDetails); // Agregar evento para mostrar detalles

    // Mostrar por defecto la sección "Buscar Dueño por RUT"
    showContent('search-owner');
});

