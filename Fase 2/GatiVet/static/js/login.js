document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Supabase después de que el DOM esté completamente cargado
    const supabaseUrl = 'https://wlnahmbigsbckwbdwezo.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsbmFobWJpZ3NiY2t3YmR3ZXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MDg5MzUsImV4cCI6MjA0NDA4NDkzNX0.CP-BaGcCf-fQD-lYrbH0_B-sKVOwUb9Xgy9-nzKjtLM'; 
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey); // Usa window.supabase.createClient

    // Evento del botón de Google
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            // Iniciar sesión con Google
            const { user, session, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
            });
        
            if (error) {
                console.error("Error en el inicio de sesión con Google:", error.message);
                return; // Salir si hay un error
            }
        
            console.log("Inicio de sesión exitoso", user);
        
            // Guardar en la tabla `Usuario` si es un nuevo usuario
            if (user) {
                const { data, error: upsertError } = await supabase.from('Usuario').upsert({
                    id_usuario: user.id,
                    nombre: user.user_metadata.full_name || '',
                    correo: user.email,
                    tipousuario: 1, // ID por defecto para usuarios de Google
                    fecha_creacion: new Date().toISOString(),
                });
        
                if (upsertError) {
                    console.error("Error al guardar usuario en la tabla:", upsertError.message);
                }
            }
        
            // Redirigir a la página de inicio o dashboard solo si hay una sesión activa
            if (session) {
                window.location.href = "/";
            }
        });
    }

    // Eventos para el modal de "Recuperar contraseña"
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const closeModal = document.getElementById('close-modal');
    const submitEmail = document.getElementById('submit-email');
    const closeConfirmationModal = document.getElementById('close-confirmation-modal');

    if (forgotPasswordLink && closeModal && submitEmail && closeConfirmationModal) {
        forgotPasswordLink.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById('forgot-password-modal').classList.remove('hidden');
        });

        closeModal.addEventListener('click', function () {
            document.getElementById('forgot-password-modal').classList.add('hidden');
        });

        submitEmail.addEventListener('click', function (event) {
            event.preventDefault();
            document.getElementById('forgot-password-modal').classList.add('hidden');
            document.getElementById('confirmation-modal').classList.remove('hidden');
        });

        closeConfirmationModal.addEventListener('click', function () {
            document.getElementById('confirmation-modal').classList.add('hidden');
        });
    }
});