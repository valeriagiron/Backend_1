import { Router } from "express";
import CartManager from "../managers/CartManager.js"; 
import ProductManager from "../managers/ProductManager.js"; 

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.status(200).json({ status: "success", payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un carrito específico por su ID
router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.cid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const cart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para agregar un producto a un carrito específico, acepta la cantidad
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; 
        const cart = await cartManager.addProductToCart(cid, pid, quantity || 1);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar la cantidad de un producto en un carrito
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; 
        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto de un carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;
