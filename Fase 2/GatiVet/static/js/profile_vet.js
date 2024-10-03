function showSection(sectionId, button) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.container');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    selectedSection.classList.remove('hidden');

    // Remover la clase activa de todos los botones
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        btn.classList.remove('bg-white', 'border-b-0');
        btn.classList.add('bg-gray-200');
    });

    // Agregar la clase activa al botón presionado
    button.classList.add('bg-white', 'border-b-0');
    button.classList.remove('bg-gray-200');
}

// Al cargar la página, mostrar la primera sección
window.onload = () => {
    const firstButton = document.querySelector('.tab-button');
    firstButton.click();
};