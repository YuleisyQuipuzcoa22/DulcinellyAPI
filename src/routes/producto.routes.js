import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

import {
  createProducto,
  getCategoria,
  getProductos,
  createCategoria,
  updateCategoria,
  updateProducto,
  deleteCategoria,
  deleteProducto,
  getUniqueProducto,
} from "../controllers/producto.controllers.js";
const router = Router();
//GET
router.get("/productos", getProductos);
router.get("/categorias", getCategoria);
router.get("/producto/:id", getUniqueProducto);
//POST
router.post("/producto", createProducto);
router.post("/categoria", verifyToken, createCategoria);
//PUT
router.put("/producto/:id", verifyToken, updateProducto);
router.put("/categoria/:id", verifyToken, updateCategoria);
//DELETE
router.delete("/producto/:id", verifyToken, deleteProducto);
router.delete("/producto/:id", verifyToken, deleteCategoria);
export default router;
