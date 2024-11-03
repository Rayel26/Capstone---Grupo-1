document.addEventListener("DOMContentLoaded", function () {
    const supabaseUrl = 'https://wlnahmbigsbckwbdwezo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM'; // Asegúrate de que esto sea seguro
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        // Login con Google
        googleLoginBtn.addEventListener('click', async () => {
            const { user, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });

            if (error) {
                console.error("Error en el inicio de sesión con Google:", error.message);
                alert("Error en el inicio de sesión. Intenta nuevamente.");
                return;
            }

            if (user) {
                const userData = {
                    id_usuario: user.id,  // Usar el ID de usuario proporcionado por Google
                    nombre: user.user_metadata.full_name || '',
                    correo: user.email || '',
                };

                console.log("Datos a enviar al servidor:", userData);

                try {
                    const response = await fetch('/google_register', { // Cambié el endpoint a '/google_register'
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const responseData = await response.json();
                    if (!response.ok) {
                        console.error("Error al guardar el usuario:", responseData.error);
                        alert("Error al guardar el usuario. Intenta nuevamente.");
                    } else {
                        console.log("Usuario guardado exitosamente:", responseData.data);
                        alert("Usuario registrado exitosamente. Bienvenido!");
                        // Aquí puedes redirigir al usuario o hacer otra acción
                        // window.location.href = '/dashboard'; // Ejemplo de redirección
                    }
                } catch (error) {
                    console.error("Error en la solicitud al servidor:", error);
                    alert("Error en la comunicación con el servidor. Intenta nuevamente.");
                }
            }
        });
    }
});
