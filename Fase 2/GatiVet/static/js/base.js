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

document.getElementById('submitComment').addEventListener('click', async () => {
    const titulo = document.getElementById('commentTitle').value;
    const calificacion = document.querySelector('input[name="rating"]:checked').value;
    const comentario = document.getElementById('commentTextArea').value;

    const data = {
        titulo: titulo,
        calificacion: parseInt(calificacion),
        texto: comentario
    };

    console.log(data);  // Agrega esta línea para verificar los datos antes de enviarlos

    // Enviar los datos al backend
    const response = await fetch('/api/guardarComentario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert("Comentario guardado exitosamente.");
    } else if (response.status === 401) {
        // Si el backend responde con un error 401, mostramos el mensaje de autenticación
        alert("Debe estar registrado en el sistema para realizar un comentario.");
    } else {
        const errorData = await response.json();  // Captura el mensaje de error
        console.error('Error:', errorData);        // Imprime el error en la consola
        alert(`Ocurrió un error al guardar el comentario: ${errorData.error}`);
    }
});

///////////////////////
//Carrito
// Función para actualizar el número de productos en el ícono del carrito
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, product) => sum + product.cantidad, 0); // Contar productos por cantidad

    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.innerText = totalItems; // Actualiza el contador en el elemento
    }
}

// Función para actualizar el total de productos
function updateCartTotal() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, product) => sum + (product.cantidad * product.valor), 0); // Calcular el total

    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = total.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }); // Actualiza el total
    }
}

// Función para actualizar la cantidad de un producto en el carrito
function updateProductQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id_producto === parseInt(productId));

    if (productIndex !== -1) {
        cart[productIndex].cantidad += change;

        // Eliminar el producto si la cantidad es 0
        if (cart[productIndex].cantidad <= 0) {
            cart.splice(productIndex, 1);
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar el número de productos en el ícono del carrito
        updateCartCount(); // Actualizar conteo aquí
        updateCartTotal(); // También actualiza el total, si es necesario
    }
}


// Actualizar el número de productos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Carga inicial del contador y total
    updateCartCount();
    updateCartTotal();

    // Asignar el evento a los botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.agregar-carrito-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = {
                id_producto: this.getAttribute('data-product-id'), // Asegúrate de que el atributo data-product-id esté presente
                valor: Number(this.getAttribute('data-product-value')), // Suponiendo que el valor del producto está en un atributo
                // Otros atributos del producto si es necesario
            };
            addToCart(product); // Llama a la función que agrega al carrito
        });
    });
});

  // Obtenemos el botón que va a activar el menú y el propio menú
  const toggleButton = document.getElementById('toggleMenu');
  const menu = document.getElementById('menu');

  // Añadimos un event listener al botón para que al hacer click cambie la visibilidad del menú
  toggleButton.addEventListener('click', function() {
    // Alternamos la clase 'hidden' para mostrar o esconder el menú
    menu.classList.toggle('hidden');
  });

  // Si se hace clic fuera del menú, el menú se oculta
  window.addEventListener('click', function(event) {
    if (!event.target.closest('#toggleMenu') && !event.target.closest('#menu')) {
      menu.classList.add('hidden');
    }
  });