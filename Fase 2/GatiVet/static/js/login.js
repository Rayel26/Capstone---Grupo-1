// Obtener el modal
var modal = document.getElementById("passwordModal");

// Obtener el enlace que abre el modal
var btn = document.getElementById("forgot-password-link");

// Obtener el <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el enlace de "Olvidé mi contraseña", se abre el modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), se cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, se cierra
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Manejar el envío del formulario de recuperación de contraseña
document.getElementById('submitRecoveryButton').addEventListener('click', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;

    // Mostrar el spinner antes de enviar la solicitud
    document.getElementById('spinner').classList.remove('hidden');

    // Enviar el correo de recuperación utilizando fetch (AJAX)
    fetch('/recover_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        // Ocultar el spinner después de recibir la respuesta
        document.getElementById('spinner').classList.add('hidden');

        if (data.success) {
            // Mostrar mensaje de éxito
            document.getElementById('successMessage').textContent = data.message;
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('errorMessage').style.display = 'none';
        } else {
            // Mostrar mensaje de error
            document.getElementById('errorMessage').textContent = data.message;
            document.getElementById('errorMessage').style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';
        }
    })
    .catch(error => {
        // Ocultar el spinner en caso de error
        document.getElementById('spinner').classList.add('hidden');

        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = 'Hubo un error al procesar tu solicitud. Intenta nuevamente.';
        document.getElementById('errorMessage').style.display = 'block';
    });
});
