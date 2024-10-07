const nodemailer = require('nodemailer');

// Configuración del transportador
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gativet30@gmail.com', // tu email
        pass: 'kiritoynico30' // usa una contraseña de aplicación para mayor seguridad
    }
});

// Función para enviar correos
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'gativet30@gmail.com',
        to,
        subject,
        text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(`Error al enviar correo: ${error}`);
        }
        console.log(`Correo enviado: ${info.response}`);
    });
};

module.exports = { sendEmail };



const { sendEmail } = require('./emailService');

// Simulando usuarios con mascotas
const users = [
    { email: 'user1@example.com', mascota: 'Firulais', fechaVacuna: '2024-10-15', fechaDesparacitacion: '2024-10-20', citas: ['2024-10-14T10:00:00Z'] },
    // Agrega más usuarios según sea necesario
];

// Función para verificar y enviar recordatorios
const checkReminders = () => {
    const today = new Date();

    users.forEach(user => {
        const { email, mascota, fechaVacuna, fechaDesparacitacion, citas } = user;
        
        // Recordatorio de vacunación
        const vacunaDate = new Date(fechaVacuna);
        const diffVacuna = Math.ceil((vacunaDate - today) / (1000 * 60 * 60 * 24)); // Diferencia en días
        if (diffVacuna === 5) {
            sendEmail(email, `Recordatorio: Vacunación de ${mascota}`, `Tienes 5 días para vacunar a ${mascota}. Fecha de vacunación: ${vacunaDate.toLocaleDateString()}.`);
        }

        // Recordatorio de desparasitaciones
        const desparacitacionDate = new Date(fechaDesparacitacion);
        const diffDesparacitacion = Math.ceil((desparacitacionDate - today) / (1000 * 60 * 60 * 24)); // Diferencia en días
        if (diffDesparacitacion === 5) {
            sendEmail(email, `Recordatorio: Desparasitaciones de ${mascota}`, `Tienes 5 días para desparacitar a ${mascota}. Fecha de desparasitaciones: ${desparacitacionDate.toLocaleDateString()}.`);
        }

        // Recordatorio de citas
        citas.forEach(cita => {
            const citaDate = new Date(cita);
            const diffCita = Math.ceil((citaDate - today) / (1000 * 60 * 60 * 24)); // Diferencia en días
            if (diffCita === 1) {
                sendEmail(email, `Recordatorio: Cita para ${mascota}`, `Tienes una cita programada para ${mascota} en 24 horas. Fecha y hora: ${citaDate.toLocaleString()}.`);
            }
        });
    });
};

// Ejecutar recordatorios (puedes programar esto con cron o un servicio de temporizador)
checkReminders();
