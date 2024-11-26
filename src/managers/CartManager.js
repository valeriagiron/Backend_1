import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    #jsonFilename;
    #carts;

    constructor() {
        this.#jsonFilename = "carts.json";
        this.#carts = [];
    }

    async #findCartById(id) {
        try {
            await this.#loadCarts();
            const cartFound = this.#carts.find((cart) => cart.id === Number(id));

            if (!cartFound) {
                throw new ErrorManager("Carrito no encontrado", 404);
            }

            return cartFound;
        } catch (error) {
            throw new ErrorManager(`Error al buscar carrito con ID ${id}: ${error.message}`, error.code || 500);
        }
    }

    async #loadCarts() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFilename) || [];
        } catch (error) {
            this.#carts = [];
        }
    }

    async getAll() {
        try {
            await this.#loadCarts();
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(`Error al obtener todos los carritos: ${error.message}`, error.code || 500);
        }
    }

    async getOneById(id) {
        try {
            return await this.#findCartById(id);
        } catch (error) {
            throw new ErrorManager(`Error al obtener carrito por ID: ${error.message}`, error.code || 500);
        }
    }

    async createCart() {
        try {
            await this.#loadCarts();
            const newCart = {
                id: generateId(this.#carts),
                products: []
            };

            this.#carts.push(newCart);
            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return newCart;
        } catch (error) {
            throw new ErrorManager(`Error al crear un nuevo carrito: ${error.message}`, error.code || 500);
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await this.#findCartById(cartId);

            const productInCart = cart.products.find((p) => p.product === Number(productId));
            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                cart.products.push({ product: Number(productId), quantity: 1 });
            }

            await writeJsonFile(paths.files, this.#jsonFilename, this.#carts);

            return cart;
        } catch (error) {
            throw new ErrorManager(
                `Error al agregar producto con ID ${productId} al carrito ${cartId}: ${error.message}`,
                error.code || 500
            );
        }
    }
}