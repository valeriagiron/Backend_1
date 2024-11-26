export default class ErrorManager extends Error {
    constructor(message, code) {
        try {
            super(message);
            this.code = code || 500;
        } catch (error) {
            // Manejo de errores inesperados al crear la instancia
            console.error("Error al inicializar ErrorManager:", error.message);
            throw new Error("Error crítico en ErrorManager");
        }
    }
}