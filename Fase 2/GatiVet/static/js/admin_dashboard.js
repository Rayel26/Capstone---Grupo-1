///Función para mostrar la sección correspondiente
function showSection(sectionId) {
    // Oculta todas las secciones
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });

    // Muestra la sección seleccionada
    document.getElementById(sectionId).classList.remove('hidden');
}

// Muestra la sección de productos por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('productos');
});
///Fin Función para mostrar la sección correspondiente