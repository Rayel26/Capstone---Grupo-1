// Productos

// Función para subir la imagen a Cloudinary
async function uploadImageToCloudinary(file) {
    const cloudName = 'dqeideoyd'; // Reemplaza con tu Cloud Name
    const uploadPreset = 'prueba'; // Reemplaza con tu Upload Preset

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    if (data.secure_url) {
        return data.secure_url; // Retornar la URL de la imagen
    } else {
        throw new Error('Error al cargar la imagen a Cloudinary');
    }
}

// Función para mostrar la sección correspondiente
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
}

// Mostrar la sección de productos por defecto al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    showSection('productos');
    loadProducts(); // Cargar productos al iniciar

    // Aquí se agrega el manejo de eventos para el tipo de producto y la marca
    const productTypeSelect = document.getElementById('productType');
    const brandSelect = document.getElementById('brand');
    const typeError = document.getElementById('typeError');
    const brandError = document.getElementById('brandError');

    productTypeSelect.addEventListener('change', function() {
        // Ocultar todos los grupos de marcas
        document.getElementById('dogFoodBrands').style.display = 'none';
        document.getElementById('catFoodBrands').style.display = 'none';
        document.getElementById('veterinaryMedicines').style.display = 'none';
        brandSelect.value = ""; // Reiniciar la selección de marcas
        brandError.style.display = 'none'; // Ocultar mensaje de error

        if (this.value === "") {
            typeError.style.display = 'block'; // Mostrar error si no hay selección
        } else {
            typeError.style.display = 'none'; // Ocultar error si hay selección
            // Mostrar las marcas correspondientes
            switch (this.value) {
                case 'alimento_perro':
                    document.getElementById('dogFoodBrands').style.display = 'block';
                    break;
                case 'alimento_gato':
                    document.getElementById('catFoodBrands').style.display = 'block';
                    break;
                case 'medicamento':
                    document.getElementById('veterinaryMedicines').style.display = 'block';
                    break;
            }
        }
    });

    brandSelect.addEventListener('change', function() {
        if (this.value === "") {
            brandError.style.display = 'block'; // Mostrar error si no hay selección
        } else {
            brandError.style.display = 'none'; // Ocultar error si hay selección
        }
    });
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
    let value = input.value.replace(/\D/g, '');
    if (value) {
        input.value = parseInt(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
    }
}

let products = []; // Aquí se almacenarán los productos ingresados
let filteredProducts = []; // Productos filtrados
let productsPerPage = 20;
let currentPage = 1;
let totalPages = 1;

// Manejo del formulario
document.getElementById('productForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evitar el envío del formulario
    let isValid = true;

    // Limpiar mensajes de error
    document.querySelectorAll('.error').forEach(error => error.classList.add('hidden'));

    // Obtener valores del formulario
    const name = document.getElementById('productName').value.trim();
    const type = document.getElementById('productType').value;
    const brand = document.getElementById('brand').value.trim();
    const priceInput = document.getElementById('price').value.replace(/\D/g, ''); // Limpiar formato
    const price = parseInt(priceInput, 10);
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    const description = document.getElementById('description').value.trim();
    const imageFile = document.getElementById('uploadImage').files[0]; // Obtener el archivo de imagen
    const selectedImageUrl = document.getElementById('productImage').value; // URL de la imagen seleccionada

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

    // Si no se selecciona imagen ni se carga una, mostrar error
    if (!imageFile && !selectedImageUrl) {
        document.getElementById('imageError').classList.remove('hidden');
        isValid = false;
    }

    // Si todo es válido, proceder a cargar la imagen si es necesario
    if (isValid) {
        let imageUrl;

        if (imageFile) {
            // Cargar imagen a Cloudinary
            try {
                imageUrl = await uploadImageToCloudinary(imageFile);
            } catch (error) {
                console.error('Error uploading image:', error);
                alert(`Error al subir la imagen: ${error.message}`);
                return;
            }
        } else {
            // Usar la URL seleccionada de Cloudinary
            imageUrl = selectedImageUrl;
        }

        // Preparar los datos del producto
        const productData = {
            name: name,
            type: type,
            brand: brand,
            price: price,
            quantity: quantity,
            description: description,
            image_url: imageUrl, // Incluir la URL de la imagen
            fecha_ingreso: getCurrentDate() // Agregar la fecha de ingreso
        };

        // Enviar los datos del producto al servidor
        try {
            const response = await fetch('/create_product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error al crear el producto: ${errorData.error || response.statusText}`);
            }

            // Restablecer el formulario y recargar productos
            document.getElementById('productForm').reset();
            loadProducts(); // Recargar productos después de añadir
        } catch (error) {
            console.error('Error en el proceso:', error);
            alert(`Error al crear el producto: ${error.message}`);
        }
    }
});



// Función para filtrar por mes
function filterByMonth() {
    const monthFilter = document.getElementById('monthFilter').value; // Formato YYYY-MM
    filteredProducts = products.filter(product => {
        // Asegúrate de que product.fecha_ingreso esté definido antes de llamar a substring
        const rowMonth = product.fecha_ingreso ? product.fecha_ingreso.substring(0, 7) : null; // Extraer YYYY-MM del producto
        return monthFilter === "" || rowMonth === monthFilter;
    });
    updatePagination(); // Actualiza paginación con productos filtrados
    console.log(products);
    console.log(filteredProducts);
}


// Mapeo de IDs a nombres de productos
const tipoProductoMap = {
    1: 'Alimento para Perros',
    2: 'Alimento para Gatos',
    3: 'Medicamento Veterinario'
};

// Función para cargar los productos
function loadProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            products = data;
            filterByMonth(); // Filtrar productos por mes si aplica
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Función para actualizar la tabla con productos
function updateTable() {
    const table = document.getElementById('productTableExt');
    table.innerHTML = ''; // Limpiar tabla existente

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    productsToDisplay.forEach(product => {
        const row = document.createElement('tr');
        const tipoProductoNombre = tipoProductoMap[product.tipo_producto_id] || 'Tipo desconocido';

        row.innerHTML = `
            <td class="py-2 px-4 border-b">${product.nombre_producto}</td>
            <td class="py-2 px-4 border-b">${tipoProductoNombre}</td>
            <td class="py-2 px-4 border-b">${product.marca}</td>
            <td class="py-2 px-4 border-b">${product.valor ? product.valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'N/A'}</td>
            <td class="py-2 px-4 border-b">${product.stock}</td>
            <td class="py-2 px-4 border-b">${product.fecha_ingreso}</td>
        `;
        table.appendChild(row);
    });
    updatePaginationControls();
}

// Función para actualizar la paginación
function updatePagination() {
    totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    currentPage = 1;
    updateTable(); // Actualizar tabla cuando cambia la paginación
}

// Actualizar los botones de control de paginación
function updatePaginationControls() {
    document.getElementById('currentPage').innerText = `Página ${currentPage} de ${totalPages}`;
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

// Manejo del botón "Siguiente"
function nextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        updateTable();
    }
}

// Manejo del botón "Anterior"
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

// Función para exportar la tabla a Excel
function exportToExcel() {
    const table = document.getElementById('productTableExt');
    const ws_data = [['Nombre del Producto', 'Tipo de Producto', 'Marca', 'Precio', 'Stock', 'Fecha de Ingreso']];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const rowData = [
            row.cells[0].innerText,
            row.cells[1].innerText,
            row.cells[2].innerText,
            row.cells[3].innerText,
            row.cells[4].innerText,
            row.cells[5].innerText
        ];
        ws_data.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock de Productos');
    XLSX.writeFile(wb, 'stock_productos.xlsx');
    alert('Exportación completada.');
}

// Función para filtrar productos por tipo
function filterProducts() {
    const filterValue = document.getElementById('productFilter').value;

    // Si el filtro está vacío, se mostrarán todos los productos
    if (filterValue === "") {
        filteredProducts = products; // Mostrar todos los productos
    } else {
        // Convertir el valor del filtro a número
        const filterTypeId = parseInt(filterValue, 10);

        // Filtrar productos basados en el tipo seleccionado
        filteredProducts = products.filter(product => {
            return product.tipo_producto_id === filterTypeId;
        });
    }

    // Actualizar la tabla de productos con los productos filtrados
    currentPage = 1; // Reiniciar la paginación a la primera página después del filtrado
    updateTable(); // Llamar a la función para actualizar la tabla
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

// Mostrar el modal de confirmación
function openConfirmModal() {
    document.getElementById('confirmModal').classList.remove('hidden');
}

// Cerrar el modal de confirmación
function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

// Al hacer clic en el botón de cancelar del modal de confirmación
document.getElementById('cancelConfirmBtn').addEventListener('click', function () {
    closeConfirmModal();
});


// Manejo del formulario de agregar usuario
document.getElementById('addModalUserForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevenir el envío inmediato del formulario

    // Mostrar el modal de confirmación
    openConfirmModal();
});

// Cuando se confirme la acción en el modal de confirmación
document.getElementById('confirmBtn').addEventListener('click', async function () {
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
    
    // ID de tipo de usuario que se enviará
    const tipo_usuario = 2;  // Cambiar a 2 como has solicitado

    // Validación de contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        closeConfirmModal();
        return;
    }

    // Validación de que la contraseña contenga al menos una mayúscula y un número
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasNumber) {
        alert('La contraseña debe contener al menos una letra mayúscula y un número');
        closeConfirmModal();
        return;
    }

    // Datos para enviar a Supabase
    const userData = {
        id_usuario: rut,
        nombre: nombre,
        appaterno: apellido,
        apmaterno: domicilio,
        correo: correo,
        contraseña: password, // Puedes considerar encriptar esta contraseña antes de enviarla
        celular: telefono,
        especialidad: especialidad,
        tipousuarioid: tipo_usuario // Ahora se envía el ID 2 directamente
    };

    try {
        // Enviar datos a Supabase
        const response = await fetch('/register_vet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        // Manejar la respuesta de Supabase
        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta de Supabase:", data);
            
            // Mostrar el modal de cuenta creada
            document.getElementById('accountCreatedModal').classList.remove('hidden');
            
            // Cerrar modal de confirmación y el modal de agregar usuario
            closeConfirmModal();
            closeAddUserModal();
            // Renderizar la tabla de usuarios o actualizar la interfaz
            renderUserTable();
        } else {
            const errorData = await response.json();
            console.error("Error al crear el usuario:", errorData);
            alert('Error al crear el usuario: ' + errorData.error);
            closeConfirmModal();
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert('Error de red: ' + error.message);
        closeConfirmModal();
    }
});

// Manejar el cierre del modal de cuenta creada
document.getElementById('closeModalButton').addEventListener('click', function () {
    document.getElementById('accountCreatedModal').classList.add('hidden');
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

//Prueba cloudinary

async function uploadImage() {
    const input = document.getElementById('productImage');
    if (input.files.length === 0) {
        alert('Por favor, selecciona una imagen para subir.');
        return;
    }

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'prueba'); // Tu upload preset
    formData.append('cloud_name', 'dqeideoyd'); // Tu cloud name

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dqeideoyd/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log('Imagen subida:', result);
        alert('Imagen subida correctamente: ' + result.secure_url);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        alert('Error al subir la imagen. Intenta nuevamente.');
    }
} 


function loadImages() {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dqeideoyd/resources/image`;

    fetch(cloudinaryUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer TU_TOKEN_DE_API', // Si es necesario
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener las imágenes: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const productImageSelect = document.getElementById('productImage');
        productImageSelect.innerHTML = '<option value="">Seleccione una imagen</option>'; // Resetea el select

        if (data.resources && data.resources.length > 0) {
            data.resources.forEach(image => {
                const option = document.createElement('option');
                option.value = image.secure_url; // URL de la imagen
                option.textContent = image.public_id; // Nombre o ID de la imagen
                productImageSelect.appendChild(option);
            });
        } else {
            console.log('No se encontraron imágenes en Cloudinary');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//JS Cloudinary

// Función para cargar imágenes de Cloudinary
async function loadImages() {
    try {
        const response = await fetch('/api/cloudinary/images');
        const images = await response.json();

        if (Array.isArray(images)) {
            const select = document.getElementById('productImage');

            images.forEach(imageUrl => {
                const option = document.createElement('option');
                option.value = imageUrl; // Guardar la URL como valor del option
                option.textContent = imageUrl.split('/').pop(); // Mostrar el nombre del archivo
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading images:', error);
    }
}

// Función para actualizar la vista previa de la imagen
function updateImagePreview() {
    const select = document.getElementById('productImage');
    const imagePreview = document.getElementById('imagePreview');
    const selectedImageUrl = select.value;

    if (selectedImageUrl) {
        imagePreview.src = selectedImageUrl; // Cambia la fuente de la imagen
        imagePreview.classList.remove('hidden'); // Muestra la imagen
    } else {
        imagePreview.classList.add('hidden'); // Oculta la imagen si no hay selección
    }
}

// Cargar imágenes al cargar la página
window.onload = loadImages;