////
//Productos
// Función para mostrar la sección correspondiente
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

// Obtener la fecha actual en formato YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Función para formatear el precio como moneda chilena
function formatCurrency(input) {
    // Eliminar cualquier carácter que no sea un número
    let value = input.value.replace(/\D/g, '');
    // Formatear el número como moneda chilena
    if (value) {
        input.value = parseInt(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }
}

let products = []; // Aquí se almacenarán los productos ingresados
let productsPerPage = 20;
let currentPage = 1;
let totalPages = 1;

// Manejo del formulario
document.getElementById('productForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    let isValid = true;

    // Limpiar mensajes de error
    document.querySelectorAll('.error').forEach(error => error.classList.add('hidden'));

    // Obtener valores del formulario
    const name = document.getElementById('productName').value.trim();
    const type = document.getElementById('productType').value;
    const brand = document.getElementById('brand').value;
    const priceInput = document.getElementById('price').value.replace(/\D/g, ''); // Limpiar formato
    const price = parseInt(priceInput, 10);
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    // Validaciones
    if (!name) {
        document.getElementById('nameError').classList.remove('hidden');
        isValid = false;
    }
    if (!type) {
        document.getElementById('typeError').classList.remove('hidden');
        isValid = false;
    }
    if (!brand) {
        document.getElementById('brandError').classList.remove('hidden');
        isValid = false;
    }
    if (!priceInput) {
        document.getElementById('priceError').classList.remove('hidden');
        isValid = false;
    }
    if (isNaN(quantity) || quantity <= 0) {
        document.getElementById('quantityError').classList.remove('hidden');
        isValid = false;
    }

    // Si todo es válido, proceder a añadir el producto
    if (isValid) {
        // Crear el contenido de la celda de stock
        let stockCellClass = quantity < 20 ? 'low-stock' : 'high-stock';
        let stockCellContent = quantity < 20 ? `¡Bajo Stock! (${quantity} disponibles)` : `${quantity} disponibles`;

        // Guardar el producto en la lista
        const product = {
            name: name,
            type: type,
            brand: brand,
            price: price,
            stockCellClass: stockCellClass,
            stockCellContent: stockCellContent,
            dateAdded: getCurrentDate() // Añadimos la fecha de ingreso
        };
        products.push(product);

        // Limpiar el formulario
        this.reset();
        document.getElementById('productImage').value = ''; // Limpiar el input de archivo

        // Actualizar paginación y tabla
        updatePagination();
    }
});

// Función para filtrar por mes
function filterByMonth() {
    const monthFilter = document.getElementById('monthFilter').value; // Formato YYYY-MM
    const filteredProducts = products.filter(product => {
        const rowMonth = product.dateAdded.substring(0, 7); // Extraer YYYY-MM
        return monthFilter === "" || rowMonth === monthFilter;
    });

    // Actualizar la lista de productos mostrados
    products = filteredProducts;
    updatePagination();
}

// Actualiza la tabla mostrando los productos correspondientes a la página actual
function updateTable() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    // Limpiar la tabla antes de agregar nuevas filas
    const table = document.getElementById('productTable');
    table.innerHTML = '';

// Agregar las filas correspondientes a la página actual
products.slice(startIndex, endIndex).forEach(product => {
    const formattedDate = new Date(product.dateAdded).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' }); // Formatear la fecha

    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="py-2 px-4 border-b">${product.name}</td>
        <td class="py-2 px-4 border-b">${product.type}</td>
        <td class="py-2 px-4 border-b">${product.brand}</td>
        <td class="py-2 px-4 border-b">${product.price ? product.price.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'N/A'}</td>
        <td class="py-2 px-4 border-b ${product.stockCellClass}">${product.stockCellContent}</td>
        <td class="py-2 px-4 border-b">${formattedDate}</td> <!-- Usar la fecha formateada -->
    `;
    table.appendChild(row);
});

// Actualizar el estado de los botones y la página actual
document.getElementById('currentPage').innerText = `Página ${currentPage} de ${totalPages}`;
document.getElementById('prevPageBtn').disabled = currentPage === 1;
document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

// Maneja el botón "Siguiente"
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
    }
}

// Maneja el botón "Anterior"
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

// Actualiza el número total de páginas y la tabla
function updatePagination() {
    totalPages = Math.ceil(products.length / productsPerPage);
    currentPage = 1; // Reiniciar a la primera página cada vez que se actualicen los productos
    updateTable();
}

// Función para exportar la tabla a Excel
function exportToExcel() {
    // Obtén la tabla de productos
    const table = document.getElementById('productTable');

    // Prepara los datos en formato de matriz para la exportación
    const ws_data = [['Nombre del Producto', 'Tipo de Producto', 'Marca', 'Precio', 'Stock', 'Fecha de Ingreso']]; // Encabezados
    const rows = table.querySelectorAll('tr');

    // Itera sobre las filas de la tabla y agrega los datos a ws_data
    rows.forEach(row => {
        const rowData = [
            row.cells[0].innerText, // Nombre del Producto
            row.cells[1].innerText, // Tipo de Producto
            row.cells[2].innerText, // Marca
            row.cells[3].innerText, // Precio
            row.cells[4].innerText, // Stock
            row.cells[5].innerText  // Fecha de Ingreso
        ];
        ws_data.push(rowData);
    });

    // Crea una hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Crea un nuevo libro de trabajo y agrega la hoja de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock de Productos');

    // Exporta el libro de trabajo a un archivo Excel
    XLSX.writeFile(wb, 'stock_productos.xlsx');

    alert('Exportación completada.');
}

// Función para filtrar productos por tipo
function filterProducts() {
    const filterValue = document.getElementById('productFilter').value;
    const filteredProducts = products.filter(product => {
        return filterValue === "" || product.type === filterValue;
    });

    // Actualizar la lista de productos mostrados
    products = filteredProducts;
    updatePagination();
}
//Fin Productos
////


////
//Gestión de usuarios

// Obtención de elementos del DOM
const userTable = document.getElementById('userTable');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

let users = [
    {
        rut: "12.345.678-9",
        nombre: "Juan Pérez",
        tipo: "usuario",
        fechaCreacion: "2023-01-15" // Ejemplo de fecha
    },
    {
        rut: "98.765.432-1",
        nombre: "María González",
        tipo: "veterinario",
        fechaCreacion: "2023-02-20" // Ejemplo de fecha
    }
];

let editingUserRut = null; // Variable para almacenar el RUT del usuario que se está editando

// Funciones para renderizar la tabla de usuarios
function renderUserTable() {
    userTable.innerHTML = '';

    const filteredUsers = users.filter(user => {
        const searchMatch = user.rut.includes(searchInput.value) || user.nombre.includes(searchInput.value);
        const filterMatch = filterSelect.value === '' || user.tipo === filterSelect.value;
        return searchMatch && filterMatch;
    });

    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-1 px-2 border-b">${user.rut}</td>
            <td class="py-1 px-2 border-b">${user.nombre}</td>
            <td class="py-1 px-2 border-b">${user.tipo}</td>
            <td class="py-1 px-2 border-b">${user.fechaCreacion}</td> <!-- Nueva columna -->
            <td class="py-1 px-2 border-b">
                <button class="text-blue-500 hover:underline" onclick="openEditUserModal('${user.rut}')">Editar</button>
                <button class="text-red-500 hover:underline" onclick="confirmDeleteUser('${user.rut}')">Eliminar</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

// Funciones para abrir y cerrar modales de agregar usuario
function openAddUserModal() {
    document.getElementById('addUserModal').classList.remove('hidden');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.add('hidden');
    document.getElementById('addModalUserForm').reset();
}

// Manejo del formulario de agregar usuario
document.getElementById('addModalUserForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los inputs
    const rut = document.getElementById('addModalRut').value;
    const nombre = document.getElementById('addModalNombre').value;
    const apellido = document.getElementById('modalApellido').value;
    const domicilio = document.getElementById('modalDomicilio').value;
    const especialidad = document.getElementById('modalEspecialidad').value; // Nuevo campo
    const telefono = document.getElementById('modalTelefono').value;
    const correo = document.getElementById('modalCorreo').value;
    const fechaNacimiento = document.getElementById('modalFechaNacimiento').value;
    const password = document.getElementById('modalPassword').value;
    const confirmPassword = document.getElementById('modalConfirmPassword').value;
    const tipo = document.getElementById('addModalTipo').value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Validación de que la contraseña contenga al menos una mayúscula y un número
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasNumber) {
        alert('La contraseña debe contener al menos una letra mayúscula y un número');
        return;
    }

    // Guardar los datos en el arreglo de usuarios
    users.push({
        rut,
        nombre,
        apellido,
        domicilio,
        especialidad, // Guardar la especialidad
        telefono,
        correo,
        fechaNacimiento,
        password,  // Puede ser que quieras encriptar esto antes de guardarlo
        tipo,
        fechaCreacion: new Date().toISOString().slice(0, 10)
    });

    // Cerrar modal y resetear formulario
    closeAddUserModal();

    // Renderizar la tabla de usuarios o actualizar la interfaz
    renderUserTable();
});

//Formato Rut
document.getElementById('addModalRut').addEventListener('input', function (event) {
    // Obtener el valor actual del input
    let value = this.value;

    // Eliminar caracteres no permitidos, permitiendo solo dígitos (0-9) y K/k al final
    value = value.replace(/[^0-9Kk]/g, ''); // Permitir K/k pero sólo en la última posición

    // Limitar a 9 caracteres
    if (value.length > 9) {
        value = value.slice(0, 9);
    }

    // Separar el dígito verificador (debe ser el último)
    const lastChar = value.charAt(value.length - 1);
    value = value.slice(0, -1); // Eliminar el último carácter (verificador)

    // Permitir solo números en los primeros 8 dígitos
    if (value.length < 8) {
        // Solo permitir números en las primeras posiciones
        if (lastChar && !/^[0-9]$/.test(lastChar)) {
            return;
        }
    } else if (value.length === 8) {
        // En el noveno dígito permite número o 'K/k'
        if (lastChar && !/^[0-9Kk]$/.test(lastChar)) {
            return;
        }
    }

    // Asegurar que 'K/k' solo se acepte como dígito verificador
    if (lastChar && value.length === 8 && !/^[0-9Kk]$/.test(lastChar)) {
        return;
    }

    // Agregar puntos cada 3 dígitos
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Concatenar el dígito verificador con el guion
    if (lastChar) {
        value = value + '-' + lastChar.toUpperCase(); // Asegura que el dígito verificador sea en mayúscula
    }

    // Actualizar el valor del input
    this.value = value;
});

// Función para formatear el teléfono automáticamente
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.getElementById('modalTelefono');
    const phoneErrorMessage = document.getElementById('phone-error-message');

    // Función para validar el formato del teléfono
    function validatePhone(phone) {
        const phonePattern = /^\+569 \d{4} \d{4}$/;
        return phonePattern.test(phone);
    }

    // Función para formatear el teléfono automáticamente mientras se escribe
    function formatPhone(value) {
        // Eliminar cualquier carácter que no sea un número
        let numericValue = value.replace(/\D/g, '');

        // Limitar a 8 dígitos
        if (numericValue.length > 8) {
            numericValue = numericValue.slice(0, 8);
        }

        // Aplicar el formato +569 xxxx yyyy si hay dígitos
        let formattedValue = '+569 ';
        if (numericValue.length > 0) {
            if (numericValue.length > 4) {
                formattedValue += numericValue.slice(0, 4) + ' ' + numericValue.slice(4);
            } else {
                formattedValue += numericValue;
            }
        }

        return formattedValue;
    }

    phoneInput.addEventListener('input', () => {
        // Obtener el valor actual del input
        let rawValue = phoneInput.value;

        // Verificar si el prefijo +569 ya está en el valor
        if (rawValue.startsWith('+569 ')) {
            // Eliminar el prefijo para procesar solo los dígitos
            rawValue = rawValue.slice(5);
        }

        // Formatear el valor actual
        phoneInput.value = formatPhone(rawValue);

        // Validar el valor del input
        if (validatePhone(phoneInput.value)) {
            phoneErrorMessage.classList.add('hidden');
        } else {
            phoneErrorMessage.classList.remove('hidden');
        }
    });
});


document.getElementById('modalPassword').addEventListener('input', function() {
    const password = this.value;
    const errorMessage = document.getElementById('password-error-message');
    const requirementsMessage = document.getElementById('password-requirements');
    const requirementsInfo = document.getElementById('pswd_info');

    // Mostrar cuadro de requisitos
    requirementsInfo.classList.remove('hidden');

    // Comprobar requisitos
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Actualizar requisitos visualmente
    
    document.getElementById('capital').classList.toggle('valid', hasUpperCase);
    document.getElementById('capital').classList.toggle('invalid', !hasUpperCase);
    
    document.getElementById('letter').classList.toggle('valid', hasLowerCase);
    document.getElementById('letter').classList.toggle('invalid', !hasLowerCase);
    
    document.getElementById('number').classList.toggle('valid', hasNumber);
    document.getElementById('number').classList.toggle('invalid', !hasNumber);
    

    // Mensaje de error
    if (!hasUpperCase || !hasNumber) {
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
    }

    requirementsMessage.innerHTML = requirementsText;
    requirementsMessage.classList.remove('hidden');
});

// Función para mostrar/ocultar la contraseña
function togglePasswordVisibility(inputId, toggleIcon) {
    const input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        toggleIcon.textContent = '🙈'; // Cambia el ícono a uno que indica que la contraseña es visible
    } else {
        input.type = "password";
        toggleIcon.textContent = '👁️'; // Cambia el ícono a uno que indica que la contraseña está oculta
    }
}

// Funciones para abrir y cerrar modales de editar usuario
// Función para abrir el modal de edición
function openEditUserModal(rut) {
    // Buscar el usuario por RUT
    const user = users.find(user => user.rut === rut);
    if (user) {
        // Rellenar los campos del modal con los datos del usuario
        document.getElementById('editModalRut').value = user.rut;
        document.getElementById('editModalNombre').value = user.nombre;
        document.getElementById('editModalApellido').value = user.apellido;
        document.getElementById('editModalDomicilio').value = user.domicilio;
        document.getElementById('editModalEspecialidad').value = user.especialidad;
        document.getElementById('editModalTelefono').value = user.telefono;
        document.getElementById('editModalCorreo').value = user.correo;
        document.getElementById('editModalFechaNacimiento').value = user.fechaNacimiento;

        // Limpiar campos de contraseña
        document.getElementById('editModalPassword').value = '';
        document.getElementById('editModalConfirmPassword').value = '';

        // Mostrar el modal
        document.getElementById('editUserModal').classList.remove('hidden');
        editingUserRut = rut; // Guardar el RUT del usuario que se está editando
    }
}

// Función para cerrar el modal de edición
function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden');
    document.getElementById('editModalUserForm').reset();
}

// Validación de formato de RUT
document.getElementById('editModalRut').addEventListener('input', function (event) {
    let value = this.value.replace(/[^0-9Kk]/g, ''); // Eliminar caracteres no permitidos
    if (value.length > 9) {
        value = value.slice(0, 9);
    }
    const lastChar = value.charAt(value.length - 1);
    value = value.slice(0, -1);
    if (value.length < 8) {
        if (lastChar && !/^[0-9]$/.test(lastChar)) {
            return;
        }
    } else if (value.length === 8) {
        if (lastChar && !/^[0-9Kk]$/.test(lastChar)) {
            return;
        }
    }
    if (lastChar && value.length === 8 && !/^[0-9Kk]$/.test(lastChar)) {
        return;
    }
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (lastChar) {
        value = value + '-' + lastChar.toUpperCase();
    }
    this.value = value;
});

// Función para validar el formato del teléfono
document.getElementById('editModalTelefono').addEventListener('input', function () {
    const phoneInput = this;
    const phoneErrorMessage = document.getElementById('phone-error-message');

    // Función para validar el formato del teléfono
    function validatePhone(phone) {
        const phonePattern = /^\+569 \d{4} \d{4}$/;
        return phonePattern.test(phone);
    }

    // Formatear el teléfono
    function formatPhone(value) {
        let numericValue = value.replace(/\D/g, '').slice(0, 8); // Limitar a 8 dígitos
        return `+569 ${numericValue.slice(0, 4)} ${numericValue.slice(4)}`;
    }

    // Formatear y validar el valor del input
    phoneInput.value = formatPhone(phoneInput.value.replace('+569 ', ''));
    if (validatePhone(phoneInput.value)) {
        phoneErrorMessage.classList.add('hidden');
    } else {
        phoneErrorMessage.classList.remove('hidden');
    }
});

// Función para validar la contraseña en tiempo real
document.getElementById('editModalPassword').addEventListener('input', function () {
    const password = this.value;
    const errorMessage = document.getElementById('password-error-message');
    const requirementsMessage = document.getElementById('password-requirements');

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    let requirementsText = '';
    if (!hasUpperCase) {
        requirementsText += '<span class="text-red-500">Debe contener al menos una letra mayúscula.</span><br>';
    } else {
        requirementsText += '<span class="text-green-500">Contiene una letra mayúscula.</span><br>';
    }

    if (!hasNumber) {
        requirementsText += '<span class="text-red-500">Debe contener al menos un número.</span>';
    } else {
        requirementsText += '<span class="text-green-500">Contiene un número.</span>';
    }

    requirementsMessage.innerHTML = requirementsText;
    requirementsMessage.classList.remove('hidden');

    if (!hasUpperCase || !hasNumber) {
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
    }
});

// Manejo del formulario de editar usuario
document.getElementById('editModalUserForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores de los inputs
    const rut = document.getElementById('editModalRut').value;
    const nombre = document.getElementById('editModalNombre').value;
    const apellido = document.getElementById('editModalApellido').value;
    const domicilio = document.getElementById('editModalDomicilio').value;
    const especialidad = document.getElementById('editModalEspecialidad').value;
    const telefono = document.getElementById('editModalTelefono').value;
    const correo = document.getElementById('editModalCorreo').value;
    const fechaNacimiento = document.getElementById('editModalFechaNacimiento').value;
    const password = document.getElementById('editModalPassword').value;
    const confirmPassword = document.getElementById('editModalConfirmPassword').value;
    const tipo = document.getElementById('editModalTipo').value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Función para validar el RUT
    function validateRUT(rut) {
        // Eliminar espacios, puntos y guiones
        rut = rut.replace(/\s/g, '').replace(/\./g, '').replace(/-/g, '');

        // Verificar el formato: debe tener entre 8 y 9 caracteres (7 a 8 números + dígito verificador)
        if (!/^\d{7,8}[0-9Kk]$/.test(rut)) {
            alert('El formato del RUT es inválido');
            return false;
        }

        // Separar el número y el dígito verificador
        const rutNumber = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();

        // Calcular el dígito verificador
        let suma = 0;
        let multiplicador = 2;

        // Iterar sobre los dígitos del RUT desde el final
        for (let i = rutNumber.length - 1; i >= 0; i--) {
            suma += parseInt(rutNumber.charAt(i)) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; // Alternar entre 2 y 7
        }

        const calculatedDV = 11 - (suma % 11);
        const expectedDV = calculatedDV === 10 ? 'K' : (calculatedDV === 11 ? '0' : calculatedDV.toString());

        // Comparar el dígito verificador ingresado con el esperado
        if (expectedDV !== dv) {
            alert('El dígito verificador del RUT es inválido');
            return false;
        }

        return true; // RUT válido
    }

    // Comprobación al escribir en el input
    document.getElementById('addModalRut').addEventListener('input', function () {
        const rutValue = this.value;

        // Llamar a la función de validación del RUT
        if (validateRUT(rutValue)) {
            // RUT válido, aquí puedes hacer algo si es necesario
            console.log('RUT válido');
        } else {
            // RUT inválido
            console.log('RUT inválido');
        }
    });


    // Validación de que la contraseña contenga al menos una mayúscula y un número
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasNumber) {
        alert('La contraseña debe contener al menos una letra mayúscula y un número');
        return;
    }

    // Actualizar el usuario en el arreglo y en la base de datos
    const userIndex = users.findIndex(user => user.rut === editingUserRut);
    if (userIndex !== -1) {
        // Mantener la fecha de creación original
        const fechaCreacion = users[userIndex].fechaCreacion;

        users[userIndex] = {
            rut,
            nombre,
            apellido,
            domicilio,
            especialidad,
            telefono,
            correo,
            fechaNacimiento,
            password, // Asegúrate de encriptar la contraseña si es necesario
            tipo,
            fechaCreacion // Mantener la fecha de creación original
        };

        // Lógica para actualizar en la base de datos
        // ...

        // Cerrar el modal y refrescar la tabla o lista de usuarios
        closeEditUserModal();
        refreshUserList(); // Función para refrescar la lista de usuarios
    }
});

function refreshUserList() {
    const userTable = document.getElementById('userTable');
    userTable.innerHTML = ''; // Limpiar la tabla actual

    // Filtrar y renderizar la lista de usuarios
    const filteredUsers = users; // Si tienes alguna lógica de filtrado, aplícala aquí
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="py-1 px-2 border-b">${user.rut}</td>
            <td class="py-1 px-2 border-b">${user.nombre}</td>
            <td class="py-1 px-2 border-b">${user.tipo}</td>
            <td class="py-1 px-2 border-b">${user.fechaCreacion}</td> <!-- Nueva columna -->
            <td class="py-1 px-2 border-b">
                <button class="text-blue-500 hover:underline" onclick="openEditUserModal('${user.rut}')">Editar</button>
                <button class="text-red-500 hover:underline" onclick="confirmDeleteUser('${user.rut}')">Eliminar</button>
            </td>
        `;
        userTable.appendChild(row);
    });
}


// Cargar la tabla de usuarios al iniciar
renderUserTable();

// FinGestión de usuarios
////

