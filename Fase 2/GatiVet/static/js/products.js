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

let selectedFilters = {
    marca: [],  // Almacena marcas seleccionadas
    tipo: [],   // Almacena tipos seleccionados
    precio: { min: null, max: null },  // Almacena el rango de precios seleccionado
    sortBy: ''  // Nuevo filtro para la ordenación
};

let products = [];  // Almacena productos cargados

// Función para cargar los productos
function loadProducts() {
    fetch('/get_products')
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Agrega esto para ver qué se está recibiendo
            products = data.products;  // Asegúrate de que esto esté correcto
            const isLoggedIn = data.is_logged_in;
            updateProductCards(isLoggedIn);
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}

// Función para actualizar las cards con productos filtrados
function updateProductCards(isLoggedIn) {
    const productList = document.getElementById('productList');

    if (!productList) {
        console.error("No se pudo encontrar el elemento con ID 'productList'");
        return;
    }

    productList.innerHTML = '';  // Limpiar las cards existentes

    // Filtrar los productos según los filtros seleccionados
    let filteredProducts = products.filter(product => {
        const matchesMarca = selectedFilters.marca.length === 0 || selectedFilters.marca.includes(product.marca);
        const matchesTipo = selectedFilters.tipo.length === 0 || selectedFilters.tipo.includes(product.tipo_producto_id);
        const matchesPrecio = (
            (selectedFilters.precio.min === null || product.valor >= selectedFilters.precio.min) &&
            (selectedFilters.precio.max === null || product.valor <= selectedFilters.precio.max)
        );
        return matchesMarca && matchesTipo && matchesPrecio;
    });

    // Ordenar los productos según el valor seleccionado
    if (selectedFilters.sortBy === 'Price_DESC') {
        filteredProducts.sort((a, b) => b.valor - a.valor);  // Ordenar por precio descendente
    } else if (selectedFilters.sortBy === 'Price_ASC') {
        filteredProducts.sort((a, b) => a.valor - b.valor);  // Ordenar por precio ascendente
    }

    // Generar las cards para los productos filtrados
    filteredProducts.forEach(product => {
        const tipoProductoNombre = tipoProductoMap[product.tipo_producto_id] || 'Tipo desconocido';

        const cardHTML = `
            <li class="product">
                <a href="/item/${product.id_producto}" class="group block overflow-hidden mt-2 rounded">
                    <img src="${product.imagen_url}"
                        alt="${product.nombre_producto}"
                        class="h-[200px] w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy" />
                    <div class="relative bg-white pt-3">
                        <h3 class="tipoProducto ml-4 text-xs text-gray-500 group-hover:underline group-hover:underline-offset-4">
                            ${tipoProductoNombre}
                        </h3>
                        <h3 class="nombreProducto text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4 ml-4">
                            ${product.nombre_producto}
                        </h3>
                        <p class="precioProducto mt-2 ml-4">
                            <span class="tracking-wider text-green-500 font-bold">
                                ${product.valor ? product.valor.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' }) : 'N/A'}
                            </span>
                        </p>
                        <h3 class="marcaProducto ml-4 text-xs text-gray-500 group-hover:underline group-hover:underline-offset-4">
                            ${product.marca}
                        </h3>
                        <h3 class="stockProducto ml-4 text-xs text-gray-500 group-hover:underline group-hover:underline-offset-4">
                            Stock: ${product.stock}
                        </h3>
                        ${isLoggedIn ? `
                            <div class="mt-3 flex justify-center text-center mb-2">
                                <button class="agregar-carrito-btn block rounded-md mb-6 bg-[#18beaa] hover:bg-[#16a89a] text-white font-bold py-2 px-4" data-product-id="${product.id_producto}">
                                    Agregar al carrito
                                </button>
                            </div>
                        ` : `
                            <div class="mt-3 flex justify-center text-center mb-2">
                                <button class="login-btn block rounded-md mb-6 bg-[#18beaa] hover:bg-[#16a89a] text-white font-bold py-2 px-4">
                                    Agregar al carrito
                                </button>
                            </div>
                        `}
                    </div>
                </a>
            </li>
        `;

        productList.insertAdjacentHTML('beforeend', cardHTML);
        
        // Agregar evento al botón "Agregar al carrito" solo si el usuario está conectado
        if (isLoggedIn) {
            const addToCartBtn = productList.querySelector(`button[data-product-id="${product.id_producto}"]`);
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();  // Evitar que se redirija al enlace del producto
                    addToCart(product);  // Agregar el producto al carrito
                    
                    // Mostrar el modal al agregar producto
                    const cartModal = document.getElementById('cartModal');
                    if (cartModal) {
                        cartModal.classList.remove('hidden');
                    } else {
                        console.error("No se pudo encontrar el elemento con ID 'cartModal'");
                    }
                });
            }
        } else {
            // Agregar evento al botón "Iniciar Sesión"
            const loginBtn = productList.querySelector('.login-btn');
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();  // Evitar que se redirija al enlace del producto
                    window.location.href = '/login';  // Redirigir a la página de inicio de sesión
                });
            }
        }
    });

    // Cerrar el modal al hacer clic en el botón de cerrar
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.add('hidden');
            }
        });
    }

    // Cerrar el modal al hacer clic en "Aceptar"
    const acceptModalBtn = document.getElementById('acceptModalBtn');
    if (acceptModalBtn) {
        acceptModalBtn.addEventListener('click', () => {
            const cartModal = document.getElementById('cartModal');
            if (cartModal) {
                cartModal.classList.add('hidden');
            }
        });
    }
}

// Event listener para el selector de ordenar
document.getElementById('SortBy').addEventListener('change', event => {
    selectedFilters.sortBy = event.target.value;  // Actualizar el valor de ordenación
    updateProductCards();  // Actualizar la lista de productos
});

// Event listener para checkboxes de filtros de marca
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
        const checkboxId = event.target.id;
        const checkboxChecked = event.target.checked;
        const checkboxValue = event.target.nextElementSibling.textContent;

        if (checkboxId.startsWith('Filter')) {
            if (checkboxChecked) {
                // Agregar el filtro
                if (checkboxId.includes('Dog') || checkboxId.includes('Cat') || checkboxId.includes('Med')) {
                    selectedFilters.marca.push(checkboxValue);  // Añadir marca
                }
            } else {
                // Remover el filtro
                if (checkboxId.includes('Dog') || checkboxId.includes('Cat') || checkboxId.includes('Med')) {
                    selectedFilters.marca = selectedFilters.marca.filter(marca => marca !== checkboxValue);
                }
            }
        }

        // Actualizar la lista de productos cuando cambian los filtros
        updateProductCards();
    });
});

// Event listener para el filtro de tipo de producto
document.querySelectorAll('#FilterType1, #FilterType2, #FilterType3').forEach(checkbox => {
    checkbox.addEventListener('change', event => {
        const checkboxId = event.target.id;
        const checkboxChecked = event.target.checked;
        const tipoProductoId = checkboxId === 'FilterType1' ? 1 : checkboxId === 'FilterType2' ? 2 : 3;

        if (checkboxChecked) {
            selectedFilters.tipo.push(tipoProductoId);  // Añadir tipo de producto
        } else {
            selectedFilters.tipo = selectedFilters.tipo.filter(tipo => tipo !== tipoProductoId);  // Remover tipo
        }

        updateProductCards();
    });
});

// Event listeners para los filtros de precio
document.getElementById('minPrice').addEventListener('input', event => {
    selectedFilters.precio.min = parseFloat(event.target.value) || null;  // Obtener precio mínimo
    updateProductCards();
});

document.getElementById('maxPrice').addEventListener('input', event => {
    selectedFilters.precio.max = parseFloat(event.target.value) || null;  // Obtener precio máximo
    updateProductCards();
});

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

// Cargar los productos al cargar la página
document.addEventListener('DOMContentLoaded', loadProducts);



///////////////////////////
//Carrito

// Función para agregar el producto al carrito
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Asegúrate de que id_producto sea un número
    const existingProductIndex = cart.findIndex(item => item.id_producto === Number(product.id_producto));

    if (existingProductIndex !== -1) {
        // Incrementar cantidad
        cart[existingProductIndex].cantidad += 1;
    } else {
        // Añadir producto
        product.cantidad = 1;
        cart.push(product);
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Actualizar el contador y el total de productos
    updateCartCount(); // Actualiza el número de productos en el carrito
    updateCartTotal(); // Actualiza el total en el carrito
}



// Asignar el evento al botón "Agregar al carrito"
document.querySelectorAll('.agregar-carrito-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.getAttribute('data-product-id');
        const product = products.find(p => p.id_producto === parseInt(productId));
        if (product) {
            addToCart(product);
        }
    });
});
