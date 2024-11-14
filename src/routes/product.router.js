import { Router } from "express";
import ProductManager from "../managers/ProductManager.js"; 
import uploader from "../utils/uploader.js";

const router = Router();
const productManager = new ProductManager();

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAll(limit);
        res.status(200).json({ status: "success", payload: products });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para obtener un producto por su ID
router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params.pid);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para crear un nuevo producto, permite la subida de imágenes
router.post("/", uploader.array("thumbnails"), async (req, res) => {
    try {
        const thumbnails = req.files?.map(file => file.filename) || [];
        const product = await productManager.insertOne(req.body, thumbnails);
        res.status(201).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para actualizar un producto por su ID, permite la subida de imágenes
router.put("/:pid", uploader.array("thumbnails"), async (req, res) => {
    try {
        const thumbnails = req.files?.map(file => file.filename) || [];
        const product = await productManager.updateOneById(req.params.pid, req.body, thumbnails);
        res.status(200).json({ status: "success", payload: product });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

// Ruta para eliminar un producto por su ID
router.delete("/:pid", async (req, res) => {
    try {
        await productManager.deleteOneById(req.params.pid);
        res.status(200).json({ status: "success" });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;
