const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");

const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();

    // Accede a 'docs' que es un array dentro de 'payload'
    const products = Array.isArray(data.payload.docs) ? data.payload.docs : [];

    // Limpia la lista de productos
    productsList.innerText = "";

    // Agrega los productos a la lista
    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
    });
};

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
    console.log("¡Lista recargada!");
});

// Se ejecuta para cargar la lista de productos al ingresar o refrescar
loadProductsList();