// Perfil
function toggleEditSaveProfile() {
    var inputs = document.querySelectorAll('#profile-form input');
    var button = document.getElementById('edit-save-button');
    var isReadOnly = inputs[0].hasAttribute('readonly');

    if (isReadOnly) {
        // Habilitar edición
        inputs.forEach(function(input) {
            input.removeAttribute('readonly');
            input.classList.add('edit-mode'); // Añadir clase para indicar edición
        });
        button.textContent = 'Guardar';
    } else {
        // Guardar cambios
        inputs.forEach(function(input) {
            input.setAttribute('readonly', 'true');
            input.classList.remove('edit-mode'); // Quitar clase de edición
        });
        button.textContent = 'Editar';
    }
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

    // Mostrar la sección de perfil por defecto
showContent('profile');

    // Toggle sidebar collapse on smaller screens
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

//fin perfil

//Modales home
//Modal ver más consulta general
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}
  
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}
//Fin modal ver más home 

//Modal ver mas vacunación
function openVaccinationModal() {
    document.getElementById('vaccination-modal').classList.remove('hidden');
}
  
function closeVaccinationModal() {
    document.getElementById('vaccination-modal').classList.add('hidden');
}
//Fin modal ver mas vacunación

//Modal ver mas toma de muestra
function openSampleModal() {
    document.getElementById('sample-modal').classList.remove('hidden');
}
  
function closeSampleModal() {
    document.getElementById('sample-modal').classList.add('hidden');
}

//Fin modal ver mas toma de muestra

//Modal ver mas especialidad
function openFelineModal() {
    document.getElementById('feline-modal').classList.remove('hidden');
}
  
function closeFelineModal() {
    document.getElementById('feline-modal').classList.add('hidden');
}
//Fin modal ver mas especialidad

//Fin modales home

//Carrusel

   