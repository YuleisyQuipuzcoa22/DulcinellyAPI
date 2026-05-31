import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createPresentacionProducto,
  createTipoPresentacion,
  createUnidadMedida,
  getPresentacionProductos,
  getTipoPresentacion,
  getUnidadMedida,
  getMasVendidos,
  updatePresentacion,
  updateTipoPresentacion,
  updateUnidadMedida,
  deletePresentacion,
  deleteTipoPresentacion,
  deleteUnidadMedida,
  getUniquePresentacionProducto
} from "../controllers/presentacion.controllers.js";
import {uploadProducto} from '../config.js'
const router = Router();
//GET
router.get("/presentacion/productos", getPresentacionProductos);
router.get("/presentacion/producto/:id", getUniquePresentacionProducto);
router.get("/tipo/presentacion", getTipoPresentacion);
router.get("/unidadmedida", getUnidadMedida);
router.get("/mas-vendidos", getMasVendidos);

//POST
router.post("/presentacion/producto", uploadProducto.single("imagen"), verifyToken, createPresentacionProducto);
router.post("/tipo/presentacion", verifyToken, createTipoPresentacion);
router.post("/unidadmedida", verifyToken, createUnidadMedida);
//PUT
router.put("/presentacion/producto/:id",uploadProducto.single("imagen"), verifyToken, updatePresentacion);
router.put("/tipo/presentacion/:id", verifyToken, updateTipoPresentacion);
router.put("/unidadmedida/:id", verifyToken, updateUnidadMedida);
//DELETE
router.delete("/presentacion/producto/:id", verifyToken, deletePresentacion);
router.delete("/tipo/presentacion/:id", verifyToken, deleteTipoPresentacion);
router.delete("/unidadmedida/:id", verifyToken, deleteUnidadMedida);

export default router;
