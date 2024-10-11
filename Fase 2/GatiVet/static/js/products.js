document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const filtersMenuButton = document.getElementById('filtersMenuButton');
    const sortMenuButton = document.getElementById('sortMenuButton');
    const sortBySelect = document.getElementById('SortBy');
    const checkboxesMarca = document.querySelectorAll('[id^="FilterBrand"]');
    const checkboxesTipo = document.querySelectorAll('[id^="FilterType"]');
    const minPriceInput = document.querySelector('input[placeholder="Mínimo"]');
    const maxPriceInput = document.querySelector('input[placeholder="Máximo"]');
    const selectedFiltersText = document.getElementById('selectedFiltersText'); // Elemento para mostrar filtros seleccionados


    // Mostrar/Ocultar el menú de filtros
    filtersMenuButton.addEventListener('click', () => {
        document.getElementById('filtersMenu').classList.toggle('hidden');
    });

    // Mostrar/Ocultar el menú de ordenar por
    sortMenuButton.addEventListener('click', () => {
        document.getElementById('sortMenu').classList.toggle('hidden');
    });

    // Modal
    const cartModal = document.getElementById('cartModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const acceptModalBtn = document.getElementById('acceptModalBtn');
    const addToCartBtns = document.querySelectorAll('.addToCartBtn');

    const openModal = () => {
        cartModal.classList.remove('hidden');
    };

    const closeModal = () => {
        cartModal.classList.add('hidden');
    };

    addToCartBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    acceptModalBtn.addEventListener('click', closeModal);

    // Contador numerito carrito
    let cartCount = 0;

    function updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        cartCountElement.textContent = cartCount;
    }

    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++;
            updateCartCount();
            button.textContent = 'Agregado';
            button.disabled = true;
        });
    });

    

    // Función para actualizar el texto de filtros seleccionados
    function updateSelectedFiltersText(selectedBrandsCount, selectedTypesCount) {
        const brandText = selectedBrandsCount > 0 ? `${selectedBrandsCount} marca(s) seleccionada(s)` : '';
        const typeText = selectedTypesCount > 0 ? `${selectedTypesCount} tipo(s) seleccionado(s)` : '';

        selectedFiltersText.textContent = [brandText, typeText].filter(Boolean).join(' y ') || 'Sin filtros seleccionados';
    }

    // Escuchar cambios en el menú de ordenar
    sortBySelect.addEventListener('change', applyFiltersAndSort);

    // Escuchar cambios en los checkboxes de marca y tipo
    checkboxesMarca.forEach(checkbox => {
        checkbox.addEventListener('change', applyFiltersAndSort);
    });

    checkboxesTipo.forEach(checkbox => {
        checkbox.addEventListener('change', applyFiltersAndSort);
    });

    // Escuchar cambios en los inputs de precio
    minPriceInput.addEventListener('input', applyFiltersAndSort);
    maxPriceInput.addEventListener('input', applyFiltersAndSort);

    // Función para reiniciar los filtros
    function resetFilters() {
        checkboxesMarca.forEach(checkbox => checkbox.checked = false);
        checkboxesTipo.forEach(checkbox => checkbox.checked = false);
        minPriceInput.value = '';
        maxPriceInput.value = '';
        applyFiltersAndSort(); // Aplicar filtros para mostrar todos los productos
    }

    // Agregar eventos a los botones de reiniciar
    const resetButtonsMarca = document.querySelectorAll('details:nth-of-type(1) button[type="button"]');
    const resetButtonsTipo = document.querySelectorAll('details:nth-of-type(2) button[type="button"]');

    resetButtonsMarca.forEach(button => {
        button.addEventListener('click', resetFilters);
    });

    resetButtonsTipo.forEach(button => {
        button.addEventListener('click', resetFilters);
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
                <a href="{{ url_for('item', productId=${product.id}) }}" class="group block overflow-hidden mt-2 rounded">
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


document.addEventListener('DOMContentLoaded', () => {
        loadProducts();
});