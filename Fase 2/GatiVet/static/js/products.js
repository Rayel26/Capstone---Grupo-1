document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const filtersMenuButton = document.getElementById('filtersMenuButton');
    const sortMenuButton = document.getElementById('sortMenuButton');
    const sortBySelect = document.getElementById('SortBy');
    const checkboxesMarca = document.querySelectorAll('[id^="FilterBrand"]');
    const checkboxesTipo = document.querySelectorAll('[id^="FilterType"]');
    const minPriceInput = document.querySelector('input[placeholder="Mínimo"]');
    const maxPriceInput = document.querySelector('input[placeholder="Máximo"]');
    const productList = document.querySelectorAll('.product');
    const selectedFiltersText = document.getElementById('selectedFiltersText'); // Elemento para mostrar filtros seleccionados

    // Mostrar todos los productos al cargar la página
    applyFiltersAndSort();

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

    // Función para aplicar filtros y ordenamiento
    function applyFiltersAndSort() {
        const selectedBrands = Array.from(checkboxesMarca)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());

        const selectedTypes = Array.from(checkboxesTipo)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());

        const priceMin = parseInt(minPriceInput.value) || 0;
        const priceMax = parseInt(maxPriceInput.value) || Infinity;

        productList.forEach(product => {
            const brand = product.querySelector('.marcaProducto').textContent.trim();
            const type = product.querySelector('.tipoProducto').textContent.trim();
            const price = parseInt(product.querySelector('.precioProducto .tracking-wider').textContent.replace(/[$,]/g, ''));

            const isBrandMatched = selectedBrands.length ? selectedBrands.includes(brand) : true;
            const isTypeMatched = selectedTypes.length ? selectedTypes.includes(type) : true;
            const isPriceMatched = (price >= priceMin && price <= priceMax);

            if (isBrandMatched && isTypeMatched && isPriceMatched) {
                product.style.display = '';
            } else {
                product.style.display = 'none';
            }
        });

        // Obtener productos visibles
        const visibleProducts = Array.from(productList).filter(product => product.style.display !== 'none');

        // Obtener el valor de ordenamiento seleccionado
        const sortValue = sortBySelect.value;

        function getProductPrice(product) {
            const priceElement = product.querySelector('.precioProducto .tracking-wider');
            if (priceElement) {
                const priceText = priceElement.textContent.replace(/[$,]/g, '').trim();
                return parseFloat(priceText);
            }
            return 0;
        }

        if (sortValue === 'Price, ASC') {
            visibleProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
        } else if (sortValue === 'Price, DESC') {
            visibleProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
        }

        // Actualizar el contenedor con el nuevo orden
        const productContainer = document.getElementById('productContainer');
        productContainer.innerHTML = '';
        
        visibleProducts.forEach(product => {
            productContainer.appendChild(product);
        });

        // Actualizar el texto de filtros seleccionados
        updateSelectedFiltersText(selectedBrands.length, selectedTypes.length);
    }

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