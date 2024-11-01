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
            <td class="py-2 px-4 border-b"></td> <!-- Celda vacía donde se agregarán los botones -->
        `;

        // Crear botones de acción
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'text-blue-500 hover:underline';
        editButton.onclick = () => editProduct(product.id); // Llama a la función editProduct

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'text-red-500 hover:underline';
        deleteButton.onclick = () => {
            console.log("ID del producto a eliminar:", product.id);
            deleteProduct(product.id);
        };

        // Agregar los botones a la celda correspondiente
        const actionCell = row.querySelector('td:last-child'); // Seleccionar la última celda (Acción)
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        // Agregar la fila a la tabla
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
//////////////////////////////

//////////////////////////////
//Gestión de usuarios

let users = []; // Variable global para almacenar usuarios
let usersfilter = []; // Variable para almacenar usuarios filtrados

async function fetchUsers() {
    try {
        const response = await fetch('/api/get_users');
        console.log("Respuesta del servidor:", response);
        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }

        users = await response.json(); // Almacena los usuarios en la variable global
        console.log("Datos de usuarios:", users);
        populateUserTable(users); // Llenar la tabla inicialmente
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}

function renderUserTable() {
    const searchTerm = document.getElementById('search').value.toLowerCase(); // Obtener término de búsqueda
    const selectedType = document.getElementById('filter').value; // Obtener tipo de usuario seleccionado

    // Filtrar usuarios
    usersfilter = users.filter(user => {
        const matchesSearch = user.nombre.toLowerCase().includes(searchTerm) || user.id_usuario.includes(searchTerm);
        const matchesType = selectedType ? user.tipousuarioid.toString() === selectedType : true; // Filtrar por tipo si se seleccionó uno
        return matchesSearch && matchesType;
    });

    populateUserTable(usersfilter); // Llenar la tabla con usuarios filtrados
}

function populateUserTable(usersToDisplay) {
    const userTableBody = document.getElementById('userTable'); // Asegúrate de que este ID es correcto
    userTableBody.innerHTML = ''; // Limpiar la tabla antes de llenarla

    usersToDisplay.forEach(user => {
        const row = document.createElement('tr');

        // Asignar el rol en función del tipousuarioid
        let userType;
        switch (user.tipousuarioid) {
            case 1:
                userType = 'Usuario';
                break;
            case 2:
                userType = 'Veterinario';
                break;
            case 3:
                userType = 'Administrador';
                break;
            default:
                userType = 'Desconocido';
        }

        row.innerHTML = `
            <td class="py-1 px-2 border-b">${user.id_usuario}</td>
            <td class="py-1 px-2 border-b">${user.nombre}</td>
            <td class="py-1 px-2 border-b">${userType}</td>
            <td class="py-1 px-2 border-b">${user.fecha_creacion || 'N/A'}</td>
            <td class="py-1 px-2 border-b">
                <button class="bg-blue-500 text-white px-2 py-1 rounded" onclick="editUserModal('${user.id_usuario}')">Editar</button>
                <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="confirmDeleteUser('${user.id_usuario}')">Eliminar</button>
            </td>
        `;

        userTableBody.appendChild(row);
    });
}

// Llamar a la función para cargar los usuarios al inicio
fetchUsers();



// Obtención de elementos del DOM
const userTable = document.getElementById('userTable');
const searchInput = document.getElementById('search');
const filterSelect = document.getElementById('filter');

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
            fetchUsers();
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
function editUserModal(id_usuario) {
    const user = users.find(user => user.id_usuario === id_usuario);

    if (user) {
        document.getElementById('editModalRut').value = user.id_usuario || '';
        document.getElementById('editModalNombre').value = user.nombre || '';
        document.getElementById('editModalApellido').value = `${user.appaterno || ''} ${user.apmaterno || ''}`; // Combina apellidos si es necesario
        document.getElementById('editModalDomicilio').value = user.domicilio_id || ''; // Si tienes un campo de domicilio
        document.getElementById('editModalEspecialidad').value = user.especialidad || '';
        document.getElementById('editModalTelefono').value = user.celular || ''; // Asigna el celular
        document.getElementById('editModalCorreo').value = user.correo || '';

        // Limpiar campos de contraseña
        document.getElementById('editModalPassword').value = user.contraseña || '';
        document.getElementById('editModalConfirmPassword').value = user.contraseña || '';

        // Mostrar el modal
        document.getElementById('editUserModal').classList.remove('hidden');
        editingUserRut = id_usuario; // Guardar el identificador del usuario que se está editando
    } else {
        console.error('Usuario no encontrado con el ID:', id_usuario);
    }
}

// Captura el evento de envío del formulario de edición
document.getElementById('editModalUserForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Obtener los valores de los inputs del modal de edición
    const rut = document.getElementById('editModalRut').value;
    const nombre = document.getElementById('editModalNombre').value;
    const apellido = document.getElementById('editModalApellido').value;
    const domicilio = document.getElementById('editModalDomicilio').value;
    const especialidad = document.getElementById('editModalEspecialidad').value;
    const telefono = document.getElementById('editModalTelefono').value;
    const correo = document.getElementById('editModalCorreo').value;
    const password = document.getElementById('editModalPassword').value;
    const confirmPassword = document.getElementById('editModalConfirmPassword').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        document.getElementById('edit-confirm-password-error-message').classList.remove('hidden');
        return;
    } else {
        document.getElementById('edit-confirm-password-error-message').classList.add('hidden');
    }


    // Crear objeto con los datos del usuario editado
    const updatedUserData = {
        rut: rut,
        nombre: nombre,
        appaterno: document.getElementById('editModalApellido').value.split(' ')[0] || '', // Asumiendo que el apellido se separa por espacio
        apmaterno: document.getElementById('editModalApellido').value.split(' ')[1] || '', // Segunda parte del apellido
        domicilio: domicilio,
        especialidad: especialidad,
        telefono: telefono,
        correo: correo,
        password: password  // Considera encriptar la contraseña antes de enviarla
    };
    

    try {
        // Enviar los datos editados a tu backend (en este caso '/api/update_user/<rut>')
        const response = await fetch(`/api/update_user/${rut}`, {
            method: 'PUT', // Usar PUT o PATCH para actualizar un recurso existente
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Usuario actualizado:', data);
        
            // Actualizar la tabla de usuarios o interfaz de usuario
            fetchUsers();
        
            // Cerrar el modal de edición
            closeEditUserModal();
        } else {
            const errorData = await response.json();
            console.error('Error al actualizar el usuario:', errorData);
            alert('Error al actualizar el usuario: ' + errorData.error);
        }        
    } catch (error) {
        console.error('Error de red:', error);
        alert('Error de red: ' + error.message);
    }
});

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.add('hidden'); // Oculta el modal
    // Opcional: Limpia los campos del modal
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


//Eliminar usuarios

let userIdToDelete; // Variable para almacenar el ID del usuario a eliminar

function confirmDeleteUser(userId) {
    userIdToDelete = userId; // Establece el ID del usuario a eliminar
    document.getElementById('confirmDeleteModal').classList.remove('hidden'); // Muestra el modal de confirmación
}

// Configura el botón de confirmación de eliminación
document.getElementById('confirmDeleteButton').onclick = async function () {
    console.log('ID del usuario a eliminar:', userIdToDelete);
    try {
        const response = await fetch(`/api/delete_user/${userIdToDelete}`, {
            method: 'DELETE',
        });

        // Manejar la respuesta
        if (response.ok) {
            const data = await response.json(); // Solo llamamos a esto si response.ok es verdadero

            // Vuelve a cargar la tabla de usuarios
            await fetchUsers();
            closeConfirmDeleteModal();
        } else {
            const errorData = await response.json();
            console.error('Error en la respuesta:', errorData); // Agrega esto para ver el error detallado
            throw new Error(errorData.error || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario: ' + error.message);
    }
};

// Función para cerrar el modal de confirmación de eliminación
function closeConfirmDeleteModal() {
    document.getElementById('confirmDeleteModal').classList.add('hidden'); // Oculta el modal
}


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


//Casos:

// Función para cargar los casos en la tabla
async function loadCases() {
    try {
        const response = await fetch('/api/casos');
        if (!response.ok) {
            throw new Error('Error al obtener los casos');
        }

        const cases = await response.json();
        const tableBody = document.getElementById('caseTable').getElementsByTagName('tbody')[0];

        // Limpia la tabla antes de llenarla
        tableBody.innerHTML = '';

        // Llena la tabla con los datos de los casos
        cases.forEach(caseData => {
            console.log("caseData:", caseData); // Verifica qué hay en caseData

            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const descriptionCell = row.insertCell(1);
            const dateCell = row.insertCell(2);
            const actionsCell = row.insertCell(3); // Nueva celda para acciones

            // Asigna las clases para el estilo
            nameCell.className = 'py-2 px-4 border-b';
            descriptionCell.className = 'py-2 px-4 border-b';
            dateCell.className = 'py-2 px-4 border-b';
            actionsCell.className = 'py-2 px-4 border-b';

            // Asigna el contenido a las celdas
            nameCell.textContent = caseData.nombre_caso;
            descriptionCell.textContent = caseData.descripcion;
            dateCell.textContent = new Date(caseData.fecha_ingreso).toLocaleDateString();

            // Botones de acción
            // Edición
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'text-blue-500 hover:underline';
            editButton.onclick = () => editCase(caseData.id_caso); // Asegúrate de usar el nombre correcto
            
            // Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'text-red-500 hover:underline ml-2';
            deleteButton.onclick = () => {
                console.log("ID del caso a eliminar:", caseData.id_caso); // Verifica el ID correcto
                deleteCase(caseData.id_caso); // Usa el nombre correcto aquí
            };
            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error al cargar los casos:', error);
    }
}

function editCase(caseId) {
    // Hacer una solicitud para obtener los datos del caso
    fetch(`/api/casos/${caseId}`)
        .then(response => response.json())
        .then(caseData => {
            // Llenar los campos del formulario con los datos del caso
            document.getElementById('editCaseId').value = caseData.id_caso;
            document.getElementById('editCaseName').value = caseData.nombre_caso;
            document.getElementById('editCaseDescription').value = caseData.descripcion;

            // Mostrar el modal
            document.getElementById('editCaseModal').classList.remove('hidden');
        })
        .catch(error => console.error('Error al obtener los datos del caso:', error));
}

function updateCase(event) {
    event.preventDefault();
    
    const caseId = document.getElementById('editCaseId').value;
    const caseName = document.getElementById('editCaseName').value;
    const caseDescription = document.getElementById('editCaseDescription').value;

    fetch(`/api/casos/${caseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nombre_caso: caseName,
            descripcion: caseDescription
        })
    })
    .then(response => {
        if (response.ok) {
            const successMessage = document.getElementById('successMessage');
            successMessage.textContent = 'Caso actualizado correctamente.';
            successMessage.classList.remove('hidden');
            setTimeout(() => {
                successMessage.classList.add('hidden');
                closeModal(); // Cerrar modal después de un tiempo
                loadCases(); // Recargar la tabla después de cerrar el modal
            }, 2000); // Cerrar después de 2 segundos
        } else {
            console.error('Error al actualizar el caso');
        }
    })
    .catch(error => console.error('Error:', error));
}

function closeModal() {
    document.getElementById('editCaseModal').classList.add('hidden');
}

// Elimina de la tabla
async function deleteCase(caseId) {
    if (!caseId) {
        console.error("El caseId es undefined o null. Verifica la asignación de ID.");
        alert("Error: No se pudo obtener el ID del caso.");
        return;
    }

    // Confirmación antes de eliminar el caso
    if (!confirm('¿Estás seguro de que quieres eliminar este caso?')) {
        return;
    }

    try {
        const response = await fetch(`/api/casos/${caseId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error al eliminar el caso:', errorData);
            throw new Error('Error al eliminar el caso');
        }

        const result = await response.json();
        alert(result.message);
        loadCases(); // Volver a cargar la tabla
    } catch (error) {
        console.error('Error al eliminar el caso:', error);
        alert('Error al eliminar el caso.');
    }
}


// Llama a la función para cargar los casos cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadCases);

// Función para subir la imagen a Cloudinary
async function uploadImageToCloudinary() {
    const uploadedImageFile = document.getElementById('uploadImageCase').files[0]; // Obtiene el archivo de imagen

    // Verifica que se haya seleccionado un archivo
    if (!uploadedImageFile) {
        alert('Por favor, selecciona o sube una imagen.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', uploadedImageFile);
        formData.append('upload_preset', 'prueba'); // Cambia por tu preset
        formData.append('folder', 'Casos');

        const response = await fetch('https://api.cloudinary.com/v1_1/dqeideoyd/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al cargar la imagen: ${errorData.message}`);
        }

        const uploadResult = await response.json();
        const imageUrl = uploadResult.secure_url; // Obtén la URL de la imagen

        // Muestra la vista previa de la imagen
        document.getElementById('imagePreview').src = imageUrl;
        document.getElementById('imagePreview').classList.remove('hidden');

        return imageUrl; // Retorna la URL de la imagen subida
    } catch (error) {
        console.error('Error al cargar la imagen a Cloudinary:', error);
        alert('Error al cargar la imagen. Intenta nuevamente.');
        return null; // Devuelve null en caso de error
    }
}

// Función para enviar el formulario
async function submitCase(event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    const caseName = document.getElementById('caseName').value;
    const caseDescription = document.getElementById('caseDescription').value;
    const uploadedImageFile = document.getElementById('uploadImageCase').files[0]; // Archivo de imagen
    const caseImageSelect = document.getElementById('CaseImage').value; // URL de la imagen seleccionada

    let imageUrl = ''; // Variable para la URL de la imagen

    // Verificar si se ha subido una imagen
    if (uploadedImageFile) {
        imageUrl = await uploadImageToCloudinary(); // Espera la carga de la imagen
        if (!imageUrl) {
            alert('Error al subir la imagen. Intenta nuevamente.');
            return; // Si no hay URL, no envíes el formulario
        }
    } else if (caseImageSelect) {
        imageUrl = caseImageSelect; // Asigna la URL de la imagen seleccionada
    } else {
        alert('Por favor, selecciona o sube una imagen.');
        return; // Si no hay imagen seleccionada ni subida, cancela
    }

    const caseData = {
        nombre_caso: caseName,
        descripcion: caseDescription,
        foto_url: imageUrl, // URL de la imagen
    };

    try {
        const response = await fetch('/api/casos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(caseData),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            alert(jsonResponse.message); // Mensaje de éxito
            document.getElementById('caseForm').reset(); // Resetear el formulario
            document.getElementById('imagePreview').classList.add('hidden'); // Ocultar la vista previa
            
            // Llama a loadCases() para actualizar la tabla inmediatamente
            loadCases();
        } else {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.error}`);
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al enviar los datos. Inténtalo de nuevo.');
    }
}

// Función para obtener imágenes de Cloudinary y llenar el select
async function fetchImages() {
    try {
        const response = await fetch('/api/cloudinary/images');
        if (!response.ok) {
            throw new Error('Error al obtener imágenes');
        }
        const images = await response.json();
        const select = document.getElementById('CaseImage');

        images.forEach(imageUrl => {
            const option = document.createElement('option');
            option.value = imageUrl; // La URL de la imagen
            option.textContent = imageUrl.split('/').pop(); // Muestra el nombre de la imagen
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

// Previsulizacion de la imagen
function showImagePreview() {
    const selectedImageUrl = document.getElementById('CaseImage').value; // Obtén la URL de la imagen seleccionada
    const imagePreview = document.getElementById('imagePreviewCase'); // Cambia aquí el ID a 'imagePreviewCase'

    if (selectedImageUrl) {
        imagePreview.src = selectedImageUrl; // Asigna la URL de la imagen seleccionada a la vista previa
        imagePreview.classList.remove('hidden'); // Muestra la imagen
    } else {
        imagePreview.classList.add('hidden'); // Oculta la imagen si no se selecciona ninguna
    }
}


// Llama a la función para obtener imágenes cuando se cargue la página
document.addEventListener('DOMContentLoaded', fetchImages);


/// FUNDACIONES:

// Función para obtener imágenes de Cloudinary y llenar el select
document.addEventListener('DOMContentLoaded', fetchFoundationImages);
async function fetchFoundationImages() {
    try {
        const response = await fetch('/api/cloudinary/images'); // Cambia la ruta si es necesario
        if (!response.ok) {
            throw new Error('Error al obtener imágenes');
        }
        const images = await response.json();
        const select = document.getElementById('FundationImage'); // ID del select

        images.forEach(imageUrl => {
            const option = document.createElement('option');
            option.value = imageUrl; // La URL de la imagen
            option.textContent = imageUrl.split('/').pop(); // Muestra el nombre de la imagen
            select.appendChild(option);
        });
    } catch (error) {
        console.error(error);
    }
}

// Previsualización de la imagen de la fundación
function showFoundationImagePreview() {
    const selectedImageUrl = document.getElementById('FundationImage').value; // Obtén la URL de la imagen seleccionada
    const imagePreview = document.getElementById('imagePreviewFoundation'); // ID actualizado para la imagen de vista previa

    if (selectedImageUrl) {
        imagePreview.src = selectedImageUrl; // Asigna la URL de la imagen seleccionada a la vista previa
        imagePreview.classList.remove('hidden'); // Muestra la imagen
    } else {
        imagePreview.classList.add('hidden'); // Oculta la imagen si no se selecciona ninguna
    }
}

// Función para subir la imagen a Cloudinary en la carpeta "Fundaciones"
async function uploadFoundationImageToCloudinary() {
    const uploadedImageFile = document.getElementById('uploadImageFund').files[0]; // Obtiene el archivo de imagen

    // Verifica que se haya seleccionado un archivo
    if (!uploadedImageFile) {
        alert('Por favor, selecciona o sube una imagen.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', uploadedImageFile);
        formData.append('upload_preset', 'prueba'); // Cambia por tu preset
        formData.append('folder', 'Fundaciones'); // Cambia la carpeta a "Fundaciones"

        const response = await fetch('https://api.cloudinary.com/v1_1/dqeideoyd/image/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al cargar la imagen: ${errorData.message}`);
        }

        const uploadResult = await response.json();
        const imageUrl = uploadResult.secure_url; // Obtén la URL de la imagen

        // Muestra la vista previa de la imagen
        document.getElementById('imagePreviewContainerFoundationImage').src = imageUrl;
        document.getElementById('imagePreviewContainerFoundationImage').classList.remove('hidden');

        return imageUrl; // Retorna la URL de la imagen subida
    } catch (error) {
        console.error('Error al cargar la imagen a Cloudinary:', error);
        alert('Error al cargar la imagen. Intenta nuevamente.');
        return null; // Devuelve null en caso de error
    }
}

// Función para cargar las fundaciones en la tabla
document.addEventListener('DOMContentLoaded', loadFoundations);
async function loadFoundations() {
    try {
        const response = await fetch('/api/fundaciones');
        if (!response.ok) {
            throw new Error('Error al obtener las fundaciones');
        }

        const foundations = await response.json();
        const tableBody = document.getElementById('foundationTableExt'); // Cambiado a 'foundationTableExt'

        // Limpia la tabla antes de llenarla
        tableBody.innerHTML = '';

        // Llena la tabla con los datos de las fundaciones
        foundations.forEach(foundationData => {
            console.log("foundationData:", foundationData); // Verifica qué hay en foundationData

            const row = tableBody.insertRow();
            const nameCell = row.insertCell(0);
            const descriptionCell = row.insertCell(1);
            const dateCell = row.insertCell(2);
            const actionsCell = row.insertCell(3); 

            // Asigna las clases para el estilo
            nameCell.className = 'py-2 px-4 border-b';
            descriptionCell.className = 'py-2 px-4 border-b';
            dateCell.className = 'py-2 px-4 border-b';
            actionsCell.className = 'py-2 px-4 border-b';

            // Asigna el contenido a las celdas
            nameCell.textContent = foundationData.nombre_fundacion;
            descriptionCell.textContent = foundationData.descripcion;
            dateCell.textContent = new Date(foundationData.fecha_ingreso).toLocaleDateString();

            // Botones de acción
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.className = 'text-blue-500 hover:underline';
            editButton.onclick = () => editFoundation(foundationData.id_fundacion); // Llama a la función editFoundation

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.className = 'text-red-500 hover:underline ml-2';
            deleteButton.onclick = () => {
                console.log("ID de la fundación a eliminar:", foundationData.id_fundacion);
                deleteFoundation(foundationData.id_fundacion);
            };

            actionsCell.appendChild(editButton);
            actionsCell.appendChild(deleteButton);
        });
    } catch (error) {
        console.error('Error al cargar las fundaciones:', error);
    }
}

// Abre modal edición
function editFoundation(foundationId) {
    // Hacer una solicitud para obtener los datos de la fundación
    fetch(`/api/fundaciones/${foundationId}`)
        .then(response => response.json())
        .then(foundationData => {
            // Llenar los campos del formulario con los datos de la fundación
            document.getElementById('editFoundationId').value = foundationData.id_fundacion;
            document.getElementById('editFoundationName').value = foundationData.nombre_fundacion;
            document.getElementById('editFoundationDescription').value = foundationData.descripcion;

            // Mostrar el modal
            document.getElementById('editFoundationModal').classList.remove('hidden');
        })
        .catch(error => console.error('Error al obtener los datos de la fundación:', error));
}

function updateFoundation(event) {
    event.preventDefault(); // Evita el envío del formulario

    const foundationId = document.getElementById('editFoundationId').value; // Obtener el ID de la fundación
    const foundationName = document.getElementById('editFoundationName').value; // Obtener el nombre de la fundación
    const foundationDescription = document.getElementById('editFoundationDescription').value; // Obtener la descripción

    fetch(`/api/fundaciones/${foundationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombre_fundacion: foundationName,
            descripcion: foundationDescription,
        }),
    })
    .then(response => {
        if (response.ok) {
            // Mensaje de éxito
            const successMessage = document.getElementById('successMessageFoundation');
            successMessage.textContent = 'Fundación actualizada exitosamente.';
            successMessage.classList.remove('hidden');

            // Cerrar el modal después de un tiempo y recargar la lista de fundaciones
            setTimeout(() => {
                successMessage.classList.add('hidden');
                closeModalFoundation(); // Cierra el modal
                loadFoundations(); // Función para recargar la lista de fundaciones
            }, 2000); // 2 segundos
        } else {
            // Manejo de errores
            console.error('Error al actualizar la fundación');
        }
    })
    .catch(error => console.error('Error en la solicitud:', error));
}


//Cierra modal edicion fundacion
function closeModalFoundation() {
    document.getElementById('editFoundationModal').classList.add('hidden');
}

// Función para enviar el formulario de fundaciones
async function submitFoundation(event) {
    event.preventDefault();

    // Elementos del formulario
    const foundationName = document.getElementById('foundationName');
    const foundationDescription = document.getElementById('foundationDes'); // ID corregido
    const uploadedImageFile = document.getElementById('uploadImageFund');
    const foundationImageSelect = document.getElementById('FundationImage');

    // Verificar si los elementos existen
    if (!foundationName || !foundationDescription || !uploadedImageFile || !foundationImageSelect) {
        console.error("Uno o más elementos del formulario no se encontraron.");
        return;
    }

    // Obtener los valores del formulario
    const foundationNameValue = foundationName.value;
    const foundationDescriptionValue = foundationDescription.value;
    const foundationImageSelectValue = foundationImageSelect.value;

    let imageUrl = '';

    // Verificar si hay imagen subida o seleccionada
    if (uploadedImageFile.files[0]) {
        imageUrl = await uploadFoundationImageToCloudinary();
        if (!imageUrl) {
            alert('Error al subir la imagen. Intenta nuevamente.');
            return;
        }
    } else if (foundationImageSelectValue) {
        imageUrl = foundationImageSelectValue;
    } else {
        alert('Por favor, selecciona o sube una imagen.');
        return;
    }

    const foundationData = {
        nombre_fundacion: foundationNameValue,
        descripcion: foundationDescriptionValue,
        foto_url: imageUrl,
    };

    try {
        const response = await fetch('/api/fundaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foundationData),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            alert(jsonResponse.message);
            document.getElementById('foundationForm').reset();
            document.getElementById('imagePreviewFoundation').classList.add('hidden');
            loadFoundations();
        } else {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.error}`);
        }
    } catch (error) {
        console.error('Error al enviar los datos:', error);
        alert('Error al enviar los datos. Inténtalo de nuevo.');
    }
}

//Eliminar fundaciones
async function deleteFoundation(foundationId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta fundación?')) {
        return;
    }

    try {
        const response = await fetch(`/api/fundaciones/${foundationId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            alert(jsonResponse.message);

            // Recarga la lista de fundaciones para reflejar los cambios
            loadFoundations();
        } else {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.error}`);
        }
    } catch (error) {
        console.error('Error al eliminar la fundación:', error);
        alert('Error al eliminar la fundación. Intenta nuevamente.');
    }
}










