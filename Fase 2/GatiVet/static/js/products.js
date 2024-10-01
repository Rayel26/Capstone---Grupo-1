document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const filtersMenuButton = document.getElementById('filtersMenuButton');
    const sortMenuButton = document.getElementById('sortMenuButton');
    const applyFiltersButton = document.getElementById('applyFiltersButton');
    const sortBySelect = document.getElementById('SortBy');
    const checkboxesMarca = document.querySelectorAll('[id^="FilterBrand"]');
    const checkboxesTipo = document.querySelectorAll('[id^="FilterType"]');
    const minPriceInput = document.querySelector('input[placeholder="Mínimo"]');
    const maxPriceInput = document.querySelector('input[placeholder="Máximo"]');
    const productList = document.querySelectorAll('.product'); // Cambiado a .product (Clase usada en los productos)

    // Mostrar/Ocultar el menú de filtros
    filtersMenuButton.addEventListener('click', () => {
        document.getElementById('filtersMenu').classList.toggle('hidden');
    });

    // Mostrar/Ocultar el menú de ordenar por
    sortMenuButton.addEventListener('click', () => {
        document.getElementById('sortMenu').classList.toggle('hidden');
    });

    // Aplicar filtros
    applyFiltersButton.addEventListener('click', () => {
        const selectedBrands = Array.from(checkboxesMarca)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());
        const selectedTypes = Array.from(checkboxesTipo)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.nextElementSibling.textContent.trim());
        const minPrice = parseFloat(minPriceInput.value) || 0;
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

        productList.forEach(product => {
            const productBrand = product.querySelector('.marcaProducto').textContent.trim();
            const productType = product.querySelector('.tipoProducto').textContent.trim();
            const productPrice = parseFloat(product.querySelector('.precioProducto').textContent.replace('$', '').replace(',', ''));

            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(productType);
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

            product.style.display = (matchesBrand && matchesType && matchesPrice) ? '' : 'none'; // Mostrar u ocultar producto
        });
    });

    // Ordenar productos por precio
    sortBySelect.addEventListener('change', () => {
        const sortBy = sortBySelect.value;
        const productsArray = Array.from(productList);

        productsArray.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.precioProducto').textContent.replace('$', '').replace(',', ''));
            const priceB = parseFloat(b.querySelector('.precioProducto').textContent.replace('$', '').replace(',', ''));
            return sortBy === 'Price, DESC' ? priceB - priceA : priceA - priceB;
        });

        const productListContainer = document.querySelector('.product-list'); // Cambiado a .product-list (Clase del contenedor de productos)
        productListContainer.innerHTML = '';
        productsArray.forEach(product => {
            productListContainer.appendChild(product);
        });
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
            e.preventDefault(); // Evitar el comportamiento predeterminado
            openModal(); // Abrir el modal cuando se hace clic
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    acceptModalBtn.addEventListener('click', closeModal);

    // Contador numerito carrito
    let cartCount = 0;

    function updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        cartCountElement.textContent = cartCount; // Actualiza el texto del contador
    }

    addToCartBtns.forEach(button => {
        button.addEventListener('click', () => {
            cartCount++; // Incrementa el contador
            updateCartCount(); // Actualiza el contador visual
            button.textContent = 'Agregado'; // Cambia el texto del botón
            button.disabled = true; // Desactiva el botón para evitar múltiples clics
        });
    });
});
