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

//////////// Ficha Clinica://////////////
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
// Declarar selectedPetId como una variable global
let selectedPetId; // Esto ahora es accesible en todo el archivo
// Fichas clinicas
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

            document.getElementById("owner-name").textContent = 
    (ownerData.nombre + " " + ownerData.appaterno + " " + ownerData.apmaterno).trim() || "Nombre no disponible";

            document.getElementById("owner-rut").textContent = ownerData.rut || "Rut no disponible";
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
        
                // Selecciona la primera mascota por defecto
                selectedPetId = data.pets[0].id_mascota; // Asigna la ID de la primera mascota
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
}

// Evento para cambiar la mascota seleccionada
document.getElementById("pet-select").addEventListener("change", function() {
    selectedPetId = this.value; // Actualiza la variable global
    loadMedicalHistory(); // Cargar el historial médico para la mascota seleccionada

    // Realiza otra llamada a la API si es necesario para obtener datos específicos de la mascota seleccionada
    const userId = document.getElementById("rut-paciente-nuevo").value;

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


/// Script para manejar el modal de vacunas-->
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}
/// Fin Script para manejar el modal de vacunas-->



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

// Función para abrir el modal y cargar los datos de la mascota seleccionada
function openEditPetModal() {
    const petSelect = document.getElementById("pet-select");
    const selectedPetId = petSelect.value; // Obtener el ID de la mascota seleccionada
    console.log("ID de mascota seleccionada:", selectedPetId); // Depuración

    // Verificar que haya una mascota seleccionada
    if (!selectedPetId) {
        alert("Por favor, selecciona una mascota.");
        return;
    }

    // Realizar la petición a la API para obtener los datos de la mascota seleccionada
    const userId = document.getElementById("rut-paciente-nuevo").value; // Obtener el ID de usuario
    console.log("ID de usuario:", userId); // Depuración

    fetch(`/get_pets_by_id?id_usuario=${userId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener mascotas:', response);
                throw new Error('Error al obtener mascotas');
            }
            return response.json();
        })
        .then(data => {
            console.log("Datos recibidos de la API:", data); // Depuración
            const selectedPet = data.pets.find(pet => pet.id_mascota == selectedPetId);
            console.log("Mascota seleccionada:", selectedPet); // Depuración
            
            if (selectedPet) {
                // Llenar los campos del modal con los datos de la mascota
                const petNameInput = document.getElementById("modal-pet-name");
                const birthDateInput = document.getElementById("modal-birth-date");
                const ageInput = document.getElementById("modal-age");
                const genderInput = document.getElementById("modal-gender");
                const microchipInput = document.getElementById("modal-microchip-number");
                const speciesInput = document.getElementById("modal-species");
                const breedInput = document.getElementById("modal-breed");
                const sizeInput = document.getElementById("modal-size");
                const coatColorInput = document.getElementById("modal-coat-color");

                // Comprobamos si los elementos existen antes de establecer su valor
                console.log("Elementos del modal:", {
                    petNameInput,
                    birthDateInput,
                    ageInput,
                    genderInput,
                    microchipInput,
                    speciesInput,
                    breedInput,
                    sizeInput,
                    coatColorInput
                }); // Depuración

                if (petNameInput) petNameInput.value = selectedPet.nombre;
                if (birthDateInput) birthDateInput.value = selectedPet.fecha_nacimiento; 
                if (ageInput) ageInput.value = ""; // Dejar vacío inicialmente
                if (genderInput) genderInput.value = selectedPet.sexo;
                if (microchipInput) microchipInput.value = selectedPet.num_microchip;
                if (speciesInput) speciesInput.value = selectedPet.especie;
                if (breedInput) breedInput.value = selectedPet.raza;
                if (sizeInput) sizeInput.value = selectedPet.tamaño;
                if (coatColorInput) coatColorInput.value = selectedPet.color_pelaje;

                // Calcular la edad después de llenar los datos
                calculateAge();

                // Mostrar el modal
                const modal = document.getElementById("modal-edit-pet");
                if (modal) {
                    modal.classList.remove("hidden");
                } else {
                    console.error("Modal no encontrado."); // Depuración
                }
            } else {
                alert("No se encontró la mascota seleccionada.");
            }
        })
        .catch(error => {
            console.error("Error al obtener datos de la mascota:", error);
            alert("Ocurrió un error al buscar los datos de la mascota.");
        });
}

function savePetChanges() {
    const petSelect = document.getElementById("pet-select");
    const selectedPetId = petSelect.value; // Obtener el ID de la mascota seleccionada
    const userId = document.getElementById("rut-paciente-nuevo").value; // Obtener el ID de usuario

    const petData = {
        nombre: document.getElementById("modal-pet-name").value,
        edad: document.getElementById("modal-age").value,
        fecha_nacimiento: document.getElementById("modal-birth-date").value,
        especie: document.getElementById("modal-species").value,
        raza: document.getElementById("modal-breed").value,
        sexo: document.getElementById("modal-gender").value,
        num_microchip: document.getElementById("modal-microchip-number").value,
        tamaño: document.getElementById("modal-size").value,
        color_pelaje: document.getElementById("modal-coat-color").value,
    };

    fetch(`/update_pet/${selectedPetId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(petData)
    })
    .then(response => {
        if (response.ok) {
            alert("Información de mascota actualizada exitosamente.");
            cerrarModal(); // Cerrar el modal después de actualizar
            // Aquí podrías agregar código para refrescar la lista de mascotas, si es necesario
        } else {
            alert("Error al actualizar la información de la mascota.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Ocurrió un error al actualizar la información de la mascota.");
    });
}


// Función para calcular la edad
function calculateAge() {
    const birthDateInput = document.getElementById("modal-birth-date");
    const ageInput = document.getElementById("modal-age");

    if (birthDateInput && ageInput) { // Verificar si los elementos existen
        const birthDate = new Date(birthDateInput.value);
        const today = new Date();

        console.log("Fecha de nacimiento:", birthDate); // Depuración
        console.log("Fecha de hoy:", today); // Depuración

        if (!isNaN(birthDate.getTime())) { // Asegurarse de que birthDate sea una fecha válida
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            // Ajustar la edad si la fecha actual es anterior al cumpleaños
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            ageInput.value = age; // Establecer la edad calculada en el campo de edad
        } else {
            ageInput.value = ""; // Limpiar el campo si no hay fecha válida
        }
    } else {
        console.error("Elementos no encontrados: birthDateInput o ageInput"); // Mensaje de error en consola
    }
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById("modal-edit-pet");
    if (modal) {
        modal.classList.add("hidden");
    } else {
        console.error("Modal no encontrado al cerrar."); // Depuración
    }
}

//Fin de script relacionado a datos de mascotas

///////////////////////////////

// Función para guardar la ficha médica
document.getElementById('saveButton').addEventListener('click', async function() {
    const consultationDate = document.getElementById('consultationDate').value;
    const consultationStartTime = document.getElementById('consultationStartTime').value;
    const animalTemperature = parseFloat(document.getElementById('animalTemperature').value);
    const heartRate = parseInt(document.getElementById('heartRate').value);
    const respiratoryRate = parseInt(document.getElementById('respiratoryRate').value);
    const patientWeight = parseFloat(document.getElementById('patientWeight').value);
    const consultationReason = document.getElementById('consultationReason').value;
    const physicalExam = document.getElementById('physicalExam').value;
    const diagnosis = document.getElementById('diagnosis').value;
    const indications = document.getElementById('indications').value;

    // Validar campos obligatorios
    if (!consultationDate || !consultationStartTime || !selectedPetId) {
        alert("Por favor, completa todos los campos obligatorios.");
        return;
    }

    console.log("Mascota seleccionada para guardar (selectedPetId):", selectedPetId); // Verificación

    const id_usuario = document.getElementById("rut-paciente-nuevo").value;

    const medicalHistory = {
        fecha: consultationDate,
        hora_inicio: consultationStartTime,
        temperatura: animalTemperature,
        frecuencia_cardiaca: heartRate,
        frecuencia_respiratoria: respiratoryRate,
        peso: patientWeight,
        motivo_consulta: consultationReason,
        examen_fisico: physicalExam,
        diagnostico: diagnosis,
        indicaciones_tratamientos: indications,
        id_mascota: selectedPetId,
        id_usuario: id_usuario
    };

    console.log("ID de mascota que se va a guardar:", selectedPetId);


    try {
        const response = await fetch('http://127.0.0.1:5000/api/insertar_historial', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(medicalHistory),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Ficha guardada correctamente!");
            document.getElementById('anamnesisForm').reset();
        } else {
            alert("Error al guardar la ficha: " + result.error);
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert("Hubo un problema al enviar la solicitud. Intenta nuevamente más tarde.");
    }
});

//Script ver historial medico
function loadMedicalHistory() {
    fetch(`/get_medical_history?id_mascota=${selectedPetId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener historiales médicos:', response);
                throw new Error('Error al obtener historiales médicos');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('#tab2 tbody');
            tbody.innerHTML = ''; // Limpiar la tabla antes de cargar nuevos datos

            data.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border border-gray-300 p-1">${record.fecha}</td>
                    <td class="border border-gray-300 p-1">${record.motivo_consulta}</td>
                    <td class="border border-gray-300 p-1">${record.examen_fisico}</td>
                    <td class="border border-gray-300 p-1">${record.diagnostico}</td>
                    <td class="border border-gray-300 p-1">${record.indicaciones_tratamientos}</td>
                    <td class="border border-gray-300 p-1">
                        <button 
                            style="color: blue; text-decoration: underline; background: none; border: none; cursor: pointer;" 
                            onclick="showDetailModal('${record.id_historial}')">
                            Ver Detalles
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error al cargar el historial médico:", error);
        });
}

//Script detalle historial
// Agrega el evento de clic al botón "Cerrar"
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("close-modal-detail").addEventListener("click", closeModalDetailHandler);
});

function closeModalDetailHandler() {
    closeModalDetail('modal-detail');
    console.log('Modal cerrado'); // Log para confirmar que se cerró
}

function closeModalDetail(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden'); // Ocultar el modal
        modal.classList.remove('flex'); // Asegúrate de que no tenga clase flex
    }
}

function showDetailModal(historialId) {
    fetch(`/get_medical_record?id_historial=${historialId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener detalle del historial médico:', response);
                throw new Error('Error al obtener detalle del historial médico');
            }
            return response.json();
        })
        .then(data => {
            // Llenar los campos del modal con los datos del historial médico
            document.getElementById("editHoraInicio").value = data.hora_inicio;
            document.getElementById("editTemperatura").value = data.temperatura;
            document.getElementById("editFrecuenciaCardiaca").value = data.frecuencia_cardiaca;
            document.getElementById("editFrecuenciaRespiratoria").value = data.frecuencia_respiratoria;
            document.getElementById("editPeso").value = data.peso;

            // Mostrar el modal
            document.getElementById("modal-detail").classList.remove("hidden");
            document.getElementById("modal-detail").classList.add("flex"); // Asegúrate de que tenga clase flex al mostrar
        })
        .catch(error => {
            console.error("Error al cargar los detalles del historial médico:", error);
        });
}

// Script para exportar a PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    
    const doc = new jsPDF({
        orientation: "portrait", // Orientación vertical
        unit: "mm", // Unidades en milímetros
    });
    
    // Datos a incluir en el PDF (ejemplo, puedes modificar según tus necesidades)
    const title = "Historial Clínico";
    const author = "Veterinario: Dr. Juan Pérez";
    const date = new Date().toLocaleDateString();
    
    // Configuración de las líneas
    const line_width = 0.1; // Ancho de la línea
    const line_color = "#000"; // Color de la línea

    // Título del documento
    doc.setFontSize(18);
    doc.setFont("bold");
    doc.text(title, 10, 20);
    
    // Detalles del autor y la fecha
    doc.setFontSize(12);
    doc.setFont("normal");
    doc.text(author, 10, 30);
    doc.text("Fecha: " + date, 10, 35);
    
    // Espaciado
    doc.text("", 10, 40); // Espacio en blanco

    // Añadir contenido de la tabla
    const table = document.querySelector("#tab2 table");
    const rows = Array.from(table.querySelectorAll("tr")).map(row => 
        Array.from(row.querySelectorAll("td, th")).map(cell => cell.innerText)
    );

    // Añadir encabezados de la tabla
    const headers = rows[0];
    headers.forEach((header, index) => {
        doc.setFont("bold");
        doc.text(header, 10 + (index * 40), 50);
    });

    // Añadir datos de cada fila
    doc.setFont("normal");
    rows.slice(1).forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            doc.text(cell, 10 + (cellIndex * 40), 60 + (rowIndex * 10)); // Ajustar según sea necesario
        });
    });

    // Guardar el documento PDF
    doc.save("historial_clinico.pdf");
}



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
// Script para Agenda

// JavaScript para cambiar entre vistas
const toggleButton = document.getElementById('toggleView');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const weeklyView = document.getElementById('weeklyView');
const monthlyView = document.getElementById('monthlyView');
const calendarDays = document.getElementById('calendarDays');
const monthTitle = document.getElementById('monthTitle');

// Obtener la fecha actual
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // Mes actual (0-indexado)

// Array de nombres de meses
const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

function generateCalendar(year, month, appointments = {}) {
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
            dayDiv.textContent = day;

            // Mostrar citas si hay
            if (appointments[day]) {
                const appointmentList = document.createElement('div');
                appointmentList.className = 'mt-1'; // Margen superior para la lista de citas
                
                // Asegurarse de que appointments[day] sea un array
                if (Array.isArray(appointments[day])) {
                    appointments[day].forEach(appointment => {
                        const appointmentDiv = document.createElement('div');
                        appointmentDiv.className = `appointment-card rounded-md shadow-md p-1 text-xs ${appointment.color} mb-1`;
                        appointmentDiv.textContent = `${appointment.time}: ${appointment.pet}`;
                        
                        appointmentDiv.addEventListener('click', () => {
                            const appointmentObject = {
                                type: appointment.type,
                                fecha: `${monthNames[month]} ${day}, ${year}`,
                                usuario: {
                                    nombre: appointment.usuario.nombre || 'Nombre no disponible',
                                    email: appointment.usuario.email || 'Email no disponible',
                                    telefono: appointment.usuario.telefono || 'Teléfono no disponible'
                                },
                                mascota: {
                                    nombre: appointment.mascota.nombre || 'Nombre no disponible',
                                    raza: appointment.mascota.raza || 'Raza no disponible',
                                    sexo: appointment.mascota.sexo || 'Sexo no disponible',
                                    icon: appointment.mascota.icon || 'Icono no disponible'
                                },
                                hora: appointment.time || 'Hora no disponible',
                                servicio: appointment.typeInfo || 'Servicio no disponible',
                                motivo: appointment.reason || 'Motivo no disponible'
                            };
                        
                            console.log('Datos de la cita antes de abrir el modal:', appointmentObject); // Para depurar
                            openModalWeek(appointmentObject);
                        });
                        
                        appointmentList.appendChild(appointmentDiv);
                    });
                } else {
                    console.warn(`No se encontró un array de citas para el día ${day}:`, appointments[day]);
                }

                dayDiv.appendChild(appointmentList);
            }
        }

        calendarDays.appendChild(dayDiv);
    }
}

async function fetchAppointments() {
    try {
        const response = await fetch('http://127.0.0.1:5000/api/agenda'); // Reemplaza con la URL real
        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos

        const appointments = {};
        data.forEach(appointment => {
            const day = new Date(appointment.fecha).getDate(); // Obtener el día del mes

            if (!appointments[day]) {
                appointments[day] = []; // Inicializar como array si no existe
            }

            // Validación de la cita
            if (appointment.servicio) { // Asegúrate de que el servicio no sea undefined
                appointments[day].push({
                    time: appointment.hora || 'Hora no disponible', // Proporciona un valor por defecto si es undefined
                    pet: `Mascota ID: ${appointment.id_mascota}`, 
                    type: appointment.servicio || 'Tipo no disponible', // Proporciona un valor por defecto
                    color: 'someColor',
                    usuario: {
                        nombre: appointment.usuario?.nombre || 'Nombre no disponible',
                        email: appointment.usuario?.email || 'Email no disponible',
                        telefono: appointment.usuario?.telefono || 'Teléfono no disponible'
                    },
                    mascota: {
                        nombre: appointment.mascota?.nombre || 'Nombre no disponible',
                        raza: appointment.mascota?.raza || 'Raza no disponible',
                        sexo: appointment.mascota?.sexo || 'Sexo no disponible',
                        icon: appointment.mascota?.icon || 'Icono no disponible'
                    },
                    fecha: appointment.fecha || 'Fecha no disponible'
                });
            } else {
                console.warn(`Cita sin servicio válida: ${JSON.stringify(appointment)}`);
            }            
        });

        // Llama a la función para generar el calendario
        generateCalendar(currentYear, currentMonth, appointments);

    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

fetchAppointments();

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
    fetchAppointments(); // Actualizar citas al cambiar de mes
});

nextMonthButton.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    fetchAppointments(); // Actualizar citas al cambiar de mes
});

// Modal de la agenda

function openModalWeek(appointment) {
    console.log('Datos de la cita:', appointment); // Para depurar

    // Verificar si appointment es un objeto válido
    if (typeof appointment !== 'object' || appointment === null) {
        console.error('El objeto de la cita no es válido:', appointment);
        return; // Salir de la función si el objeto no es válido
    }

    // Completa los campos del modal con los datos de la cita
    document.getElementById('modalweek-type').innerText = `Cita: ${appointment.type || 'Tipo no disponible'}`;
    document.getElementById('modalweek-date').innerText = `${new Date(appointment.fecha).toLocaleDateString()}`;

    // Información del dueño
    document.getElementById('modalweek-owner').innerText = appointment.usuario?.nombre || 'Nombre no disponible';
    document.getElementById('modalweek-email').innerText = appointment.usuario?.email || 'Email no disponible';
    document.getElementById('modalweek-phone').innerText = appointment.usuario?.telefono || 'Teléfono no disponible';

    // Información de la mascota
    document.getElementById('modalweek-pet').innerText = appointment.mascota?.nombre || 'Nombre no disponible';
    document.getElementById('modalweek-breed').innerText = `${appointment.mascota?.raza || 'Raza no disponible'}, ${appointment.mascota?.sexo || 'Sexo no disponible'}`;

    // Detalles de la cita
    document.getElementById('modalweek-start-time').value = appointment.hora; // Hora de inicio
    document.getElementById('modalweek-service').innerText = appointment.servicio || 'Servicio no disponible';
    document.getElementById('modalweek-reason').innerText = appointment.motivo || 'Motivo no disponible';

    // Mostrar el modal
    const modal = document.getElementById('modalweek');
    modal.classList.remove('hidden');
    modal.classList.add('flex'); // Usar flex para mostrar el modal
}

// Función para cerrar el modal
document.getElementById('closeModalWeek').addEventListener('click', () => {
    const modal = document.getElementById('modalweek');
    modal.classList.add('hidden');
    modal.classList.remove('flex'); // Ocultar el modal
});

// Inicializar la agenda al cargar la página
window.onload = fetchAppointments;


// Función para cerrar el modal
function closeModalWeek() {
    document.getElementById('modalweek').classList.add('hidden');
}


// Función para cancelar la cita
function cancelAppointmentWeek() {
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

        console.log("Guardando cambios:", startTime, endTime);
        alert("Los cambios se realizaron correctamente.");
        editTime.textContent = "Editar";
        startTimeInput.disabled = true;
        endTimeInput.disabled = true;
    } else {
        editTime.textContent = "Guardar Cambios";
        startTimeInput.disabled = false;
        endTimeInput.disabled = false;
    }

    isEditing = !isEditing;
}

// Selecciona el input de tiempo
const timeInput = document.getElementById('consultationStartTime');

// Agrega un evento de clic al input
timeInput.addEventListener('click', function () {
    this.showPicker();
});



///////////vacunas////////////////////////////////// 
// Función para abrir el modal
function openAddVaccineModal() {
    document.getElementById('addVaccineModal').classList.remove('hidden');
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('addVaccineModal');
    modal.classList.add('hidden');
}

// Función para agregar vacuna
async function addVaccine() {
    const fecha = document.getElementById('vacunaFecha').value;
    const nombre = document.getElementById('vacunaNombre').value;
    const dosis = document.getElementById('vacunaDosis').value;
    const veterinario = document.getElementById('vacunaVeterinario').value;
    const id_mascota = document.getElementById("pet-select").value; // Obtener el ID de la mascota seleccionada

    // Validación de campos vacíos
    if (!fecha || !nombre || !dosis || !veterinario) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear un nuevo objeto de vacuna
    const nuevaVacuna = {
        fecha: fecha,
        nombre_vacuna: nombre,
        dosis: dosis,
        nombre_veterinario: veterinario,
        id_mascota: id_mascota // Agregar la FK a la tabla Mascota
    };

    try {
        // Llamada a la ruta Flask para insertar la nueva vacuna
        const response = await fetch('/add_vaccine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaVacuna)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al agregar la vacuna:', errorData);
            alert('Error al agregar la vacuna. Inténtalo de nuevo.');
            return;
        }

        const data = await response.json();
        console.log('Vacuna añadida:', data);

        // Añadir una nueva fila a la tabla
        const tbody = document.getElementById('vacunasTableBody');
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td class="border border-gray-300 px-2 py-1">${fecha}</td>
            <td class="border border-gray-300 px-2 py-1">${nombre}</td>
            <td class="border border-gray-300 px-2 py-1">${dosis}</td>
            <td class="border border-gray-300 px-2 py-1">${veterinario}</td>
        `;
        tbody.appendChild(newRow);

        // Cerrar el modal y resetear el formulario
        closeModal();
        document.getElementById('addVaccineForm').reset();
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        alert('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
}

// Función para obtener las vacunas de la mascota seleccionada
function fetchVaccinesByPetId(petId) {
    // Realizar la petición a la ruta de Flask para obtener las vacunas
    fetch(`/get_vaccines_by_pet_id?id_mascota=${petId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener vacunas:', response);
                throw new Error('Error al obtener vacunas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de vacunas obtenidos:', data); // Añade este log
            if (data.error) {
                alert(data.error);
                return;
            }
            displayVaccines(data.vaccines);
        })
        .catch(error => {
            console.error("Error al obtener vacunas:", error);
            alert("Ocurrió un error al buscar las vacunas.");
        });
}

// Función para mostrar las vacunas en la interfaz
function displayVaccines(vaccines) {
    const tbody = document.getElementById('vacunasTableBody');
    tbody.innerHTML = ""; // Limpiar contenido previo

    if (!vaccines || vaccines.length === 0) {
    const noVaccinesRow = document.createElement("tr");
    noVaccinesRow.innerHTML = `<td colspan="4" class="border border-gray-300 text-center">No hay vacunas registradas para esta mascota.</td>`;
    tbody.appendChild(noVaccinesRow);
    return;
}

    vaccines.forEach(vaccine => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="border border-gray-300 px-2 py-1">${vaccine.fecha}</td>
            <td class="border border-gray-300 px-2 py-1">${vaccine.nombre_vacuna}</td>
            <td class="border border-gray-300 px-2 py-1">${vaccine.dosis}</td>
            <td class="border border-gray-300 px-2 py-1">${vaccine.nombre_veterinario}</td>
        `;
        tbody.appendChild(newRow);
    });
}

// Evento para cambiar la mascota seleccionada
document.getElementById("pet-select").addEventListener("change", function() {
    const selectedPetId = this.value;

    // Mostrar datos de la mascota seleccionada
    fetchVaccinesByPetId(selectedPetId); // Llama a la función para obtener las vacunas
});


///////////Desparacitaciones//////////////////////////////////
// Función para abrir el modal de desparasitaciones
function openAddDewormerModal() {
    document.getElementById('desparasitacionModal').classList.remove('hidden');
}

// Función para cerrar el modal
function closeDewormerModal() {
    const modal = document.getElementById('desparasitacionModal');
    modal.classList.add('hidden');
}

// Función para agregar desparasitaciones
async function addDewormer() {
    const fecha = document.getElementById('newDesparasitacionFecha').value;
    const producto = document.getElementById('newDesparasitacionProducto').value;
    const dosis = document.getElementById('newDesparasitacionDosis').value;
    const veterinario = document.getElementById('newDesparasitacionVeterinario').value;
    const id_mascota = document.getElementById("pet-select").value; // Obtener el ID de la mascota seleccionada

    // Validación de campos vacíos
    if (!fecha || !producto || !dosis || !veterinario) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Crear un nuevo objeto de desparacitación
    const nuevaDesparasitacion = {
        fecha: fecha,
        nombre_desparacitador: producto,
        dosis: dosis,
        nombre_veterinario: veterinario,
        id_mascota: id_mascota // Agregar la FK a la tabla Mascota
    };

    try {
        // Llamada a la ruta Flask para insertar la nueva desparacitación
        const response = await fetch('/add_dewormer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevaDesparasitacion)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al agregar la desparacitación:', errorData);
            alert('Error al agregar la desparacitación. Inténtalo de nuevo.');
            return;
        }

        const data = await response.json();
        console.log('Desparacitación añadida:', data);

        // Llamar a la función para obtener las desparasitaciones actualizadas
        fetchDewormersByPetId(id_mascota); // Actualizar la lista de desparasitaciones

        // Resetear el formulario
        const form = document.getElementById('addDewormerForm'); // Asegúrate de que este sea el ID correcto
        if (form) {
            form.reset();
        } else {
            console.error("El formulario no se encontró.");
        }

        // Cerrar el modal
        closeDewormerModal();
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        alert('Error al procesar la solicitud. Inténtalo de nuevo.');
    }
}


// Función para obtener desparasitaciones de la mascota seleccionada
function fetchDewormersByPetId(petId) {
    // Realizar la petición a la ruta de Flask para obtener las desparasitaciones
    fetch(`/get_dewormer_by_pet_id?id_mascota=${petId}`)
        .then(response => {
            if (!response.ok) {
                console.error('Error al obtener desparasitaciones:', response);
                throw new Error('Error al obtener desparasitaciones');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de desparasitaciones obtenidos:', data);
            if (data.error) {
                alert(data.error);
                return;
            }
            displayDewormers(data.dewormer);
        })
        .catch(error => {
            console.error("Error al obtener desparasitaciones:", error);
            alert("Ocurrió un error al buscar las desparasitaciones.");
        });
}

// Función para mostrar las desparasitaciones en la interfaz
function displayDewormers(dewormers) {
    const tbody = document.getElementById('desparasitacionesTableBody');
    tbody.innerHTML = ""; // Limpiar contenido previo

    if (!dewormers || dewormers.length === 0) {
        const noDewormersRow = document.createElement("tr");
        noDewormersRow.innerHTML = `<td colspan="4" class="border border-gray-300 text-center">No hay desparasitaciones registradas para esta mascota.</td>`;
        tbody.appendChild(noDewormersRow);
        return;
    }

    dewormers.forEach(dewormer => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="border border-gray-300 px-2 py-1">${dewormer.fecha}</td>
            <td class="border border-gray-300 px-2 py-1">${dewormer.nombre_desparacitador}</td>
            <td class="border border-gray-300 px-2 py-1">${dewormer.dosis}</td>
            <td class="border border-gray-300 px-2 py-1">${dewormer.nombre_veterinario}</td>
        `;
        tbody.appendChild(newRow);
    });
}

// Evento para cambiar la mascota seleccionada
document.getElementById("pet-select").addEventListener("change", function() {
    const selectedPetId = this.value;

    // Mostrar datos de desparasitaciones de la mascota seleccionada
    fetchDewormersByPetId(selectedPetId); // Llama a la función para obtener las desparasitaciones
});
