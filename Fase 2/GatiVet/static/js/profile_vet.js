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

editForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Recopilar los datos del formulario
    const formData = {
        rut: document.getElementById('edit-rut').value,
        nombre: document.getElementById('edit-nombre-doctor').value,
        apellido: document.getElementById('edit-apellido').value,
        especialidad: document.getElementById('edit-especialidad').value,
        correo: document.getElementById('edit-correo').value,
        telefono: document.getElementById('edit-telefono-dom').value,
        domicilio: document.getElementById('edit-domicilio').value,
        numeracion: document.getElementById('edit-numeracion').value,
    };

    try {
        const response = await fetch('/save_vet_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Enviar los datos del formulario
        });

        // Verificar si la respuesta es un JSON válido
        const contentType = response.headers.get('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('La respuesta no es un JSON válido.');
        }

        const responseData = await response.json(); // Obtener la respuesta del backend

        if (!response.ok) {
            throw new Error(responseData.error || 'Error al guardar los datos');
        }

        // Actualizar los valores en la vista principal
        document.getElementById('rut').value = formData.rut;
        document.getElementById('nombre-doctor').value = formData.nombre;
        document.getElementById('apellido').value = formData.apellido;
        document.getElementById('especialidad').value = formData.especialidad;
        document.getElementById('domicilio').value = formData.domicilio;
        document.getElementById('numeracion').value = formData.numeracion;
        document.getElementById('telefono-dom').value = formData.telefono;
        document.getElementById('correo').value = formData.correo;

        console.log('ID Domicilio creado:', responseData.id_domicilio);

        // Cerrar el modal
        document.getElementById('editModal').classList.add('hidden');
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        alert(`Error al guardar los datos: ${error.message}`);
    }
});


//Editar imagen

// Cuando se selecciona una nueva foto, automáticamente se envía el formulario
document.getElementById('upload-photo').addEventListener('change', function() {
    document.getElementById('upload-form').submit();
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

// Función para buscar por ID de usuario
function searchPetByUserId() {
    const userId = document.getElementById("rut-paciente-nuevo").value; // Obtener el ID de usuario

    // Limpiar el select de mascotas
    const petSelect = document.getElementById("pet-select");
    petSelect.innerHTML = ""; // Limpiar opciones previas

    console.log(`Buscando mascotas para el ID de usuario: ${userId}`);

    // Realizar la petición a la ruta de Flask para obtener las mascotas
    fetch(`/get_pets_by_id?id_usuario=${userId}`)
        .then(response => {
            console.log(`Estado de la respuesta: ${response.status}`);
            if (!response.ok) {
                console.error('Error en la respuesta de la API:', response);
                throw new Error('Error al obtener mascotas');
            }
            return response.json();
        })
        .then(data => { // Cambié 'pets' a 'data' para mayor claridad
            console.log('Datos obtenidos:', data);
            if (data.error) {
                alert(data.error);
                document.getElementById("pet-data").classList.add("hidden");
                return;
            }

            // Mostrar la información del dueño
            const ownerData = data.user; // Asignar los datos del dueño

            document.getElementById("owner-name").textContent = ownerData.nombre || "Nombre no disponible";
            document.getElementById("owner-address").textContent = ownerData.direccion || "Dirección no disponible";
            document.getElementById("owner-phone").textContent = ownerData.celular || "Teléfono no disponible";
            document.getElementById("owner-email").textContent = ownerData.correo || "Correo no disponible";

            // Mostrar la sección con datos del dueño
            document.getElementById("pet-data").classList.remove("hidden");

            if (data.pets && data.pets.length > 0) {
                data.pets.forEach(pet => {
                    const option = document.createElement("option");
                    option.value = pet.id_mascota;
                    option.textContent = pet.nombre; // Mostrar el nombre de la mascota
                    petSelect.appendChild(option);
                });

                // Mostrar datos de la primera mascota por defecto
                showPetData(data.pets[0]);
            } else {
                alert("No se encontraron mascotas para este ID de usuario.");
                document.getElementById("pet-data").classList.add("hidden");
            }
        })
        .catch(error => {
            console.error("Error al obtener mascotas:", error);
            alert("Ocurrió un error al buscar las mascotas.");
        });
}

// Función para mostrar los datos de la mascota seleccionada
function showPetData(pet) {
    document.getElementById("pet-name").value = pet.nombre;
    document.getElementById("birth-date").value = pet.fecha_nacimiento; 
    document.getElementById("age").value = pet.edad;
    document.getElementById("gender").value = pet.sexo;
    document.getElementById("microchip-number").value = pet.num_microchip;
    document.getElementById("species").value = pet.especie;
    document.getElementById("breed").value = pet.raza;
    document.getElementById("size").value = pet.tamaño;
    document.getElementById("coat-color").value = pet.color_pelaje;

    // Cargar la imagen de la mascota desde la URL
    const profilePicture = document.getElementById("profile-picture-mas");
    console.log("URL de la foto de la mascota:", pet.foto_url); // Verificar la URL

    // Cambiar el src a la URL de la mascota
    profilePicture.src = pet.foto_url;

    // Manejo de error en caso de que la imagen no se cargue
    profilePicture.onerror = function() {
        console.error("No se pudo cargar la imagen desde la URL:", pet.foto_url);
        profilePicture.src = ""; // Dejar en blanco si no se puede cargar
    };

    document.getElementById("tab2").innerHTML = `<p>${pet.historia_clinica || 'No disponible'}</p>`;
    document.getElementById("tab3").innerHTML = `<p>${pet.vacunas || 'No disponible'}</p>`;
    document.getElementById("tab4").innerHTML = `<p>${pet.desparasitaciones || 'No disponible'}</p>`;
    document.getElementById("tab5").innerHTML = `<p>${pet.estudios || 'No disponible'}</p>`;
}

// Evento para cambiar la mascota seleccionada
document.getElementById("pet-select").addEventListener("change", function() {
    const selectedPetId = this.value;

    // Realiza otra llamada a la API si es necesario para obtener datos específicos de la mascota seleccionada
    const userId = document.getElementById("rut-paciente-nuevo").value; // Aquí también deberías usar el ID de usuario

    fetch(`/get_pets_by_id?id_usuario=${userId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener mascotas:', response);
                throw new Error('Error al obtener mascotas');
            }
            return response.json();
        })
        .then(data => {
            const selectedPet = data.pets.find(pet => pet.id_mascota == selectedPetId);
            if (selectedPet) {
                showPetData(selectedPet);
            }
        })
        .catch(error => {
            console.error("Error al obtener mascotas:", error);
        });
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
const saveMessage = document.getElementById('save-message');
const petSelect = document.getElementById("pet-select"); // Para obtener el ID de la mascota seleccionada
const statusInfo = document.getElementById('status-info'); // Contenedor para mensajes debajo de la imagen

// Función para inicializar el estado de los checkboxes según los datos de la BD
async function inicializarEstado(petId) {
    try {
        console.log(`Cargando datos para la mascota con ID: ${petId}`);  // Depuración

        // Hacer una solicitud GET para obtener el estado actual de la mascota
        const response = await fetch(`/get-pet-status?id_mascota=${petId}`);

        console.log('Respuesta recibida:', response);  // Depuración

        if (!response.ok) {
            throw new Error(`Error al obtener el estado de la mascota. Código de estado: ${response.status}`);
        }

        const petData = await response.json();
        console.log('Datos de la mascota recibidos:', petData);  // Depuración

        // Actualizar los checkboxes y campos con la información de la BD
        reproducerCheckbox.checked = petData.reproducer;
        treatmentCheckbox.checked = petData.treatment;
        sterilizedCheckbox.checked = petData.sterilized;
        deceasedCheckbox.checked = petData.deceased;
        causeOfDeathInput.value = petData.causeOfDeath || '';

        // Mostrar los mensajes debajo de la imagen automáticamente
        mostrarEstado(petData);

    } catch (error) {
        console.error('Error al obtener los datos del estado de la mascota:', error);  // Depuración

        // Si el error es un problema con el formato JSON
        if (error instanceof SyntaxError) {
            console.error('Error al parsear la respuesta como JSON:', error.message);
            saveMessage.textContent = "Error inesperado en los datos de la respuesta.";
        } else {
            saveMessage.textContent = error.message;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadPhotoInput = document.getElementById('upload-photo');
    const profilePicture = document.getElementById('profile-picture-mas');
    const statusInfo = document.getElementById('status-info');

    // Cuando se cambia el archivo
    uploadPhotoInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            // Asegúrate de tener el id_mascota disponible en algún lugar, por ejemplo, en un atributo de datos
            const idMascota = profilePicture.getAttribute('data-id-mascota'); // Asegúrate de que este atributo exista en tu HTML
            if (idMascota) {
                formData.append('id_mascota', idMascota);

                fetch('/upload-image', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        profilePicture.src = data.image_url; // Cambiar la imagen mostrada
                        statusInfo.textContent = 'Imagen actualizada con éxito.';
                    } else {
                        statusInfo.textContent = `Error: ${data.message}`;
                    }
                })
                .catch(error => {
                    console.error('Error al subir la imagen:', error);
                    statusInfo.textContent = 'Error al subir la imagen.';
                });
            } else {
                alert('No se pudo encontrar el id_mascota.');
            }
        }
    });
});


// Función que se ejecuta al presionar "Guardar Estado"
saveStatusBtn.addEventListener('click', async function() {
    // Obtener el ID de la mascota seleccionada
    const selectedPetId = petSelect.value;

    // Preparar los datos a enviar al servidor
    const petData = {
        id_mascota: selectedPetId,  // Mantener el uso de id_mascota
        reproducer: reproducerCheckbox.checked,
        treatment: treatmentCheckbox.checked,
        sterilized: sterilizedCheckbox.checked,
        deceased: deceasedCheckbox.checked,
        causeOfDeath: deceasedCheckbox.checked ? causeOfDeathInput.value.trim() : null // Solo enviar si está fallecido
    };

    try {
        console.log('Enviando datos al servidor:', petData);  // Depuración

        // Hacer una solicitud POST al servidor para actualizar la base de datos
        const response = await fetch('/update-pet-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(petData) // Enviar los datos con el ID de la mascota
        });

        const result = await response.json();
        console.log('Respuesta del servidor al guardar:', result);  // Depuración

        // Mostrar el mensaje de éxito o error basado en la respuesta
        if (result.success) {
            saveMessage.textContent = "Estado guardado correctamente.";
            mostrarEstado(petData); // Actualizar el estado visual debajo de la imagen
        } else {
            saveMessage.textContent = "Hubo un error al guardar el estado.";
        }

    } catch (error) {
        console.error('Error al guardar el estado de la mascota:', error);  // Depuración
        saveMessage.textContent = "Error en la conexión.";
    }

    // Limpiar el mensaje después de 2 segundos
    setTimeout(() => {
        saveMessage.textContent = '';
    }, 2000);
});


// Función para mostrar el estado del paciente debajo de la imagen
function mostrarEstado(petData) {
    let mensajes = [];

    // Verificar el estado de fallecido
    if (petData.deceased) {
        mensajes.push(`Fallecido: ${petData.causeOfDeath || 'Causa no especificada'}`);
    } else {
        // Verificar si está en tratamiento
        if (petData.treatment) {
            mensajes.push("Está en tratamiento anticonceptivo");
        }
        // Verificar si es reproductor
        if (petData.reproducer) {
            mensajes.push("Es reproductor/a");
        }
        // Verificar si está esterilizado/castrado
        if (petData.sterilized) {
            mensajes.push("Está esterilizado/castrado");
        }
    }

    // Si no hay mensajes, mostrar "Estado no disponible"
    if (mensajes.length === 0) {
        mensajes.push("Estado no disponible");
    }

    // Mostrar los mensajes en el contenedor debajo de la imagen
    statusInfo.textContent = mensajes.join(', ');
}

// Evento que se ejecuta al cambiar la selección de mascota
petSelect.addEventListener('change', function() {
    const selectedPetId = petSelect.value;
    
    if (selectedPetId) {
        inicializarEstado(selectedPetId); // Cargar el estado de la mascota seleccionada desde la BD
    }
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