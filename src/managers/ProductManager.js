import paths from "../utils/paths.js";
import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
    #jsonFilename;
    #products;

    constructor() {
        this.#jsonFilename = "products.json";
    }

    async #findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));

        if (!productFound) {
            throw new ErrorManager("ID no encontrado", 404);
        }

        return productFound;
    }

    async getAll(limit) {
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFilename);
            return limit ? this.#products.slice(0, limit) : this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        return await this.#findOneById(id);
    }

    async insertOne(data) {
        const { title, description, code, price, stock, category, thumbnails = [] } = data;

        if (!title || !description || !code || price === undefined || stock === undefined || !category) {
            throw new ErrorManager("Faltan datos obligatorios", 400);
        }

        const product = {
            id: generateId(await this.getAll()),
            title,
            description,
            code,
            price: Number(price),
            status: true,
            stock: Number(stock),
            category,
            thumbnails
        };

        this.#products.push(product);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

        return product;
    }

    async updateOneById(id, data) {
        const { title, description, code, price, stock, category, thumbnails } = data;
        const productFound = await this.#findOneById(id);

        const updatedProduct = {
            ...productFound,
            title: title || productFound.title,
            description: description || productFound.description,
            code: code || productFound.code,
            price: price !== undefined ? Number(price) : productFound.price,
            stock: stock !== undefined ? Number(stock) : productFound.stock,
            category: category || productFound.category,
            thumbnails: thumbnails || productFound.thumbnails
        };

        const index = this.#products.findIndex((item) => item.id === Number(id));
        this.#products[index] = updatedProduct;
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);

        return updatedProduct;
    }

    async deleteOneById(id) {
        const productFound = await this.#findOneById(id);
        const index = this.#products.findIndex((item) => item.id === Number(id));
        this.#products.splice(index, 1);
        await writeJsonFile(paths.files, this.#jsonFilename, this.#products);
    }
}
