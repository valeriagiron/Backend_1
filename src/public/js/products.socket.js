const socket = io();

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const inputProductId = document.getElementById("input-product-id");
const btnDeleteProducts = document.getElementById("btn-delete-products");
const errorMessage = document.getElementById("error-message");

socket.on("products-list", (data) => {
    const products = data.products ?? [];
    productsList.innerText = "";

    products.forEach((product) => {
        productsList.innerHTML += `<li>Id: ${product.id} - Nombre: ${product.title}</li>`;
    });
});

productsForm.onsubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    errorMessage.innerText = "";

    form.reset();

    socket.emit("insert-product", {
        title: formData.get("title"),
        status: formData.get("status") || "off",
        stock: formData.get("stock"),
    });
};

btnDeleteProducts.onclick = () => {
    console.log("inputProductId.value", inputProductId)
    console.log("inputProductId.value", inputProductId.value)

    const id = Number(inputProductId.value);
    inputProductId.value = "";
    errorMessage.innerText = "";

    if (id > 0) {
        socket.emit("delete-products", { id });
    }
};

socket.on("error-message", (data) => {
    errorMessage.innerText = data.message;
});