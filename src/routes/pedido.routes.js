import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getPedidos,
  createPedido,
  updatePedido,
  createDetallePedido
} from "../controllers/pedido.controllers.js";
import {
  createCotizacion,
  getCotizacion,
  updateCotizacion,
  deleteCotizacion,
} from "../controllers/cotizacion.controllers.js";
import {uploadCotizacion} from '../config.js'
const router = Router();
//GET
router.get("/pedidos", verifyToken, getPedidos);
router.get("/cotizacion", verifyToken, getCotizacion);
//POST
router.post("/pedido", verifyToken, createPedido);
router.post("/detallepedido", verifyToken, createDetallePedido);
router.post("/pedido/cotizacion", verifyToken,uploadCotizacion.single("imagen"), createCotizacion);
//PUT
router.put("/pedido/:id", verifyToken, updatePedido);
router.put("/cotizacion/:id", verifyToken, updateCotizacion);
//DELETE
router.delete("/cotizacion", verifyToken, deleteCotizacion);
export default router;
