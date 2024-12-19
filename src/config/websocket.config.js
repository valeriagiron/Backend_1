import { Server } from "socket.io";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const productManager = new ProductManager();
const cartManager= new CartManager();

export const config = (httpServer) => {
    const socketServer = new Server(httpServer);

    socketServer.on("connection", async (socket) => {
        console.log("Conexión establecida", socket.id);

        let cartId ="67634fb401a2fa4a4f338e58";

        if (!cartId) {
            const newCart = await cartManager.insertOne({ products: [] });
            cartId = newCart._id;
        }

        socket.emit("cart-updated", { cart: await cartManager.getOneById(cartId) });

        const emitPaginatedProducts = async (page = 1, sort = "asc") => {
            const products = await productManager.getAll({ page, sort });
            socketServer.emit("products-list", products);
        };

        await emitPaginatedProducts();

        socket.on("change-sort", async (data) => {
            const { sort } = data;
            await emitPaginatedProducts(1, sort); // Resetea a la página 1 al cambiar el orden
        });

        socket.on("change-page", async (data) => {
            const { page, sort } = data;
            await emitPaginatedProducts(page, sort);
        });

        socket.on("insert-product", async (data) => {
            try {
                await productManager.insertOne(data);

                await emitPaginatedProducts();
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-product", async (data) => {
            try {
                await productManager.deleteOneById(data.id);

                await emitPaginatedProducts();
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("add-product", async ({ productId }) => {
            try {

                await cartManager.addOneProduct(cartId, productId);

                const updatedCart = await cartManager.getOneById(cartId);

                socket.emit("cart-updated", { cart: updatedCart });

                socket.emit("success-message", { message: "Producto agregado al carrito" });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        socket.on("remove-product", async ({ productId }) => {
            try {
                if (!cartId) {
                    throw new Error("No tienes un carrito asociado");
                }

                await cartManager.deleteOneProduct(cartId, productId);

                const updatedCart = await cartManager.getOneById(cartId);
                socket.emit("cart-updated", { cart: updatedCart });

                socket.emit("success-message", { message: "Producto eliminado del carrito" });
            } catch (error) {
                socket.emit("error-message", { message: error.message });
            }
        });

        socket.on("delete-cart", async (data) => {
            try {
                const cartId = data.id;
                const updatedCart= await cartManager.removeAllProductsById(cartId);

                socket.emit("cart-updated", { cart: updatedCart });
            } catch (error) {
                socketServer.emit("error-message", { message: error.message });
            }
        });

        socket.on("disconnect", () => {
            console.log("Se desconecto un cliente");
        });
    });
};