import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "carts.json";
    }

    async #findCartById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((cart) => cart.id === Number(id));

        if (!cartFound) {
            throw new ErrorManager("Carrito no encontrado", 404);
        }

        return cartFound;
    }

    async getAll() {
        return await readJsonFile(paths.files, this.#jsonFilename);
    }

    async getOneById(id) {
        return await this.#findCartById(id);
    }

    async createCart() {
        const newCart = {
            id: generateId(await this.getAll()),
            products: []
        };

        this.#carts.push(newCart);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.#findCartById(cartId);

        const productInCart = cart.products.find((p) => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

        return cart;
    }
}
