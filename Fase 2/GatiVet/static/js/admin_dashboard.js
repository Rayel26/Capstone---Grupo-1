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
// FinGestión de usuarios
////

