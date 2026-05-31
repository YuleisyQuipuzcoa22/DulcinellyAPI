import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {getMetodoPago,getPagos,createMetodoPago,createPago,updatePago, updateMetodoPago,deleteMetodoPago,getPagoByPedido} from '../controllers/pago.controllers.js'
const router = Router();
//GET
router.get("/pagos", verifyToken, getPagos);
router.get("/metodospago", getMetodoPago);
router.get("/pago/pedido/:idPedido", verifyToken, getPagoByPedido);


//POST
router.post("/pago", verifyToken, createPago);
router.post("/metodopago", verifyToken, createMetodoPago);
//PUT
router.put("/pago/:id", verifyToken, updatePago);
router.put("/metodopago/:id", verifyToken, updateMetodoPago);
//DELETE
router.delete("/metodopago/:id", verifyToken, deleteMetodoPago);
export default router;
