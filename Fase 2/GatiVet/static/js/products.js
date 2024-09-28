document.getElementById('filterButton').addEventListener('click', function () {
    var filterMenu = document.getElementById('filterMenu');
    filterMenu.classList.toggle('hidden');
});

document.getElementById('addToCartBtn').addEventListener('click', function () {
    // Mostrar el modal
    document.getElementById('cartModal').classList.remove('hidden');
    document.getElementById('cartModal').classList.add('flex');

    // Incrementar el número en el icono del carrito
    let cartCountElement = document.getElementById('cartCount');
    let currentCount = parseInt(cartCountElement.textContent) || 0;
    cartCountElement.textContent = currentCount + 1;
});

document.getElementById('acceptModalBtn').addEventListener('click', function () {
    // Cerrar el modal
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});

// Manejador para el botón de cerrar el modal (X)
document.getElementById('closeModalBtn').addEventListener('click', function () {
    // Cerrar el modal
    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('cartModal').classList.remove('flex');
});

/////////Manejador de filtros y ordenar po

document.addEventListener("DOMContentLoaded", () => {
const sortBySelect = document.getElementById("SortBy");
const filterInStock = document.getElementById("FilterInStock");
const filterOutOfStock = document.getElementById("FilterOutOfStock");
const filterPriceFrom = document.getElementById("FilterPriceFrom");
const filterPriceTo = document.getElementById("FilterPriceTo");
  const filterBrands = document.querySelectorAll('input[id^="FilterBrand"]'); // Para las marcas

  // Datos de ejemplo: productos (esto debes reemplazar con los productos reales de tu backend o frontend)
let products = [
    { id: 1, name: "Producto 1", price: 50000, inStock: true, brand: "Royal Canin" },
    { id: 2, name: "Producto 2", price: 30000, inStock: false, brand: "Royal Canin" },
    { id: 3, name: "Producto 3", price: 60000, inStock: true, brand: "BrandX" },
    // Añade más productos según sea necesario
];

  // Función para renderizar los productos filtrados y ordenados
const renderProducts = (filteredProducts) => {
    console.log("Productos mostrados:", filteredProducts);
    // Aquí debes reemplazar este console.log con código que actualice el DOM para mostrar los productos
};

  // Función que aplica los filtros y la ordenación
const applyFilters = () => {
    let filteredProducts = [...products];

    // Filtro de disponibilidad
    if (filterInStock.checked && !filterOutOfStock.checked) {
    filteredProducts = filteredProducts.filter(product => product.inStock);
    } else if (!filterInStock.checked && filterOutOfStock.checked) {
    filteredProducts = filteredProducts.filter(product => !product.inStock);
    }

    // Filtro de precio
    const minPrice = filterPriceFrom.value ? parseInt(filterPriceFrom.value) : 0;
    const maxPrice = filterPriceTo.value ? parseInt(filterPriceTo.value) : Infinity;
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);

    // Filtro de marcas
    const selectedBrands = Array.from(filterBrands).filter(brandCheckbox => brandCheckbox.checked).map(cb => cb.value);
    if (selectedBrands.length > 0) {
    filteredProducts = filteredProducts.filter(product => selectedBrands.includes(product.brand));
    }

    // Ordenar por precio
    if (sortBySelect.value === "Price, ASC") {
    filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBySelect.value === "Price, DESC") {
    filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Renderizar los productos filtrados
    renderProducts(filteredProducts);
};

  // Listeners para los filtros y el ordenamiento
sortBySelect.addEventListener("change", applyFilters);
filterInStock.addEventListener("change", applyFilters);
filterOutOfStock.addEventListener("change", applyFilters);
filterPriceFrom.addEventListener("input", applyFilters);
filterPriceTo.addEventListener("input", applyFilters);
filterBrands.forEach(brandCheckbox => brandCheckbox.addEventListener("change", applyFilters));

  // Renderizar inicialmente los productos sin filtros
renderProducts(products);
});

