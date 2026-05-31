import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getEntregas,
  getDistritos,
  getSedes,
  createDistrito,
  createEntrega,
  createSede,
  updateDistrito,
  updateEntrega,
  updateSede,
  deleteDistrito,
  deleteSede
} from "../controllers/entrega.controllers.js";
const router = Router();
//GET
router.get("/sedes", getSedes);
router.get("/entregas", getEntregas);
router.get("/distritos", getDistritos);

//POST
router.post("/entrega", verifyToken, createEntrega);
router.post("/sede", verifyToken, createSede);
router.post("/distrito", verifyToken, createDistrito);
//PUT
router.put("/entrega/:id", verifyToken, updateEntrega);
router.put("/sede/:id", verifyToken, updateSede);
router.put("/distrito/:id", verifyToken, updateDistrito);
//DELETE
router.delete("/sede/:id", verifyToken, deleteSede);
router.delete("/distrito/:id", verifyToken, deleteDistrito);

export default router;
