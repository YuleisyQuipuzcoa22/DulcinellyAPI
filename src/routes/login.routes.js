import express from "express";
import { login, logout } from "../controllers/login.controllers.js";
// NO importes componentes de React aquí
const router = express.Router();

// Ruta para iniciar sesión
router.post("/login", login);
router.post("/logout", logout);

// Elimina o comenta la línea de React Router


export default router;
