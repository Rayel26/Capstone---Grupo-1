//////////////// caja de comentario
document.addEventListener("DOMContentLoaded", function() {
    const maxWords = 40; // Máximo de palabras permitidas
    const commentTextArea = document.getElementById('commentTextArea');
    const wordCount = document.getElementById('wordCount');

    document.getElementById('commentIcon').addEventListener('click', function() {
        console.log("El modal se está abriendo."); // Mensaje en la consola
        document.getElementById('commentModal').classList.remove('hidden');
        updateWordCount(); // Actualizar conteo al abrir el modal
    });

    document.getElementById('closeModal').addEventListener('click', function() {
        console.log("El modal se está cerrando."); // Mensaje en la consola
        document.getElementById('commentModal').classList.add('hidden');
    });

    commentTextArea.addEventListener('input', function() {
        updateWordCount();
        handleHoverEffect();
    });

    document.getElementById('submitComment').addEventListener('click', function() {
        const commentText = commentTextArea.value;
        const errorMessage = document.getElementById('error-message');

        if (commentText.length < 15) {
            errorMessage.classList.remove('hidden');
        } else {
            errorMessage.classList.add('hidden');
            alert("Comentario enviado: " + commentText); // Esto es un ejemplo
            commentTextArea.value = ''; // Limpiar textarea
            updateWordCount(); // Resetear conteo
            console.log("Comentario enviado: ", commentText); // Mensaje en la consola
            document.getElementById('commentModal').classList.add('hidden'); // Cerrar modal
        }
    });

    function updateWordCount() {
        const words = commentTextArea.value.trim().split(/\s+/).filter(word => word.length > 0);
        const remainingWords = maxWords - words.length;
        wordCount.textContent = `Palabras restantes: ${remainingWords}`;

        // Limitar el número de palabras
        if (remainingWords < 0) {
            commentTextArea.value = words.slice(0, maxWords).join(' '); // Limitar a maxWords
            updateWordCount(); // Actualizar el conteo después de limitar
        }
    }

    function handleHoverEffect() {
        const words = commentTextArea.value.trim().split(/\s+/).filter(word => word.length > 0);
        const remainingWords = maxWords - words.length;

        if (remainingWords <= 0) {
            commentTextArea.classList.add('border-red-500'); // Agregar clase para efecto hover en rojo
            commentTextArea.addEventListener('input', preventInput); // Desactivar el input
        } else {
            commentTextArea.classList.remove('border-red-500'); // Quitar efecto hover
            commentTextArea.removeEventListener('input', preventInput); // Reactivar el input
        }
    }

    function preventInput(event) {
        event.preventDefault(); // Prevenir el ingreso de nuevas letras
    }

    // Llenar las estrellas de acuerdo a la selección
    const stars = document.querySelectorAll('input[name="rating"]');
    const labels = document.querySelectorAll('label[for^="star"]');

    stars.forEach((star, index) => {
        star.addEventListener('change', () => {
            // Llenar las estrellas según la selección
            labels.forEach((label, i) => {
                if (i <= index) {
                    label.classList.remove('text-gray-400');
                    label.classList.add('text-yellow-500');
                } else {
                    label.classList.remove('text-yellow-500');
                    label.classList.add('text-gray-400');
                }
            });
        });
    });
});