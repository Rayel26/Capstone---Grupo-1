document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const filtersMenuButton = document.getElementById('filtersMenuButton');
    const sortMenuButton = document.getElementById('sortMenuButton');
    const sortBySelect = document.getElementById('SortBy');
    const checkboxesMarca = document.querySelectorAll('[id^="FilterCatFood"], [id^="FilterDogFood"], [id^="FilterMed"]');
    const checkboxesTipo = document.querySelectorAll('[id^="FilterType"]');
    const minPriceInput = document.querySelector('input[placeholder="Mínimo"]');
    const maxPriceInput = document.querySelector('input[placeholder="Máximo"]');
    const selectedFiltersText = document.getElementById('selectedFiltersText');

    // Mostrar/Ocultar el menú de filtros
    filtersMenuButton.addEventListener('click', () => {
        document.getElementById('filtersMenu').classList.toggle('hidden');
    });

    // Mostrar/Ocultar el menú de ordenar por
    sortMenuButton.addEventListener('click', () => {
        document.getElementById('sortMenu').classList.toggle('hidden');
    });

    // Función para actualizar el texto de filtros seleccionados
    const updateSelectedFiltersText = () => {
        const selectedBrands = Array.from(checkboxesMarca).filter(checkbox => checkbox.checked).map(checkbox => checkbox.nextElementSibling.textContent);
        const selectedTypes = Array.from(checkboxesTipo).filter(checkbox => checkbox.checked).map(checkbox => checkbox.nextElementSibling.textContent);
        
        // Actualiza el texto de filtros seleccionados
        if (selectedBrands.length || selectedTypes.length) {
            selectedFiltersText.textContent = `Filtros seleccionados: ${[...selectedBrands, ...selectedTypes].join(', ')}`;
        } else {
            selectedFiltersText.textContent = 'Sin filtros seleccionados';
        }
    };

    // Agregar eventos a los checkboxes
    checkboxesMarca.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedFiltersText);
    });

    checkboxesTipo.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedFiltersText);
    });

    // Función para manejar el ordenamiento
    sortBySelect.addEventListener('change', () => {
        const sortOrder = sortBySelect.value;

        // Lógica de ordenamiento aquí
        if (sortOrder) {
            console.log(`Ordenar por: ${sortOrder}`);
            // Aquí deberías implementar la lógica para ordenar tus productos
        }
    });
});


//Carga de productos BD

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
            updateProductCards(); // Actualizar las cards de productos
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Función para actualizar las cards con productos
function updateProductCards() {
    const productList = document.getElementById('productList');

    console.log('Elemento productList:', productList); // Verifica si se encuentra correctamente

    if (!productList) {
        console.error("No se pudo encontrar el elemento con ID 'productList'");
        return; // Salir de la función si no se encuentra el elemento.
    }

    productList.innerHTML = ''; // Limpiar cards existentes

    products.forEach(product => {
        const tipoProductoNombre = tipoProductoMap[product.tipo_producto_id] || 'Tipo desconocido';

        const cardHTML = `
        <li class="product">
            <a href="/item/${product.id_producto}" class="group block overflow-hidden mt-2 rounded">
                <img src="${product.imagen_url || 'https://res.cloudinary.com/dqeideoyd/image/upload/v1728504996/Alimento-Perro-Cachorro-Pedigree-Carne-Pollo-y-Cereales-15-kg_oxsjsh.webp'}"
                    alt="${product.nombre_producto}"
                    class="h-[200px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[200px]"
                    loading="lazy" />
                <div class="relative bg-white pt-3">
                    <h3 class="tipoProducto ml-4 text-xs text-gray-500 group-hover:underline group-hover:underline-offset-4">
                        ${tipoProductoNombre}
                    </h3>
                    <h3 class="nombreProducto text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4 ml-4">
                        ${product.nombre_producto}
                    </h3>
                    <p class="precioProducto mt-2 ml-4">
                        <span class="sr-only">Precio normal</span>
                        <span class="tracking-wider text-green-500 font-bold">${product.valor ? product.valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'N/A'}</span>
                    </p>
                    <h3 class="marcaProducto ml-4 text-xs text-gray-500 group-hover:underline group-hover:underline-offset-4">
                        ${product.marca}
                    </h3>
                    <div class="mt-3 flex justify-center text-center mb-2">
                        <button class="block rounded-md mb-6 bg-[#18beaa] hover:bg-[#16a89a] text-white font-bold py-2 px-4 focus:outline-none text-sm transition-transform transform-gpu hover:-translate-y-1 hover:shadow-md cursor-pointer addToCartBtn" data-product-id="${product.id}">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </a>
        </li>
    `;
        productList.insertAdjacentHTML('beforeend', cardHTML);
    });
}





// Función que se ejecuta al hacer clic en un producto
function redirectToItem(productId) {
    // Redirigir a la página item.html con el ID del producto
    window.location.href = `/item/${productId}`;
}

// Añadir un evento de clic a los productos
document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('click', () => {
        const productId = item.getAttribute('data-product-id'); // Asumiendo que tienes un atributo data-product-id
        redirectToItem(productId);
    });
});


document.addEventListener('DOMContentLoaded', () => {
        loadProducts();
});