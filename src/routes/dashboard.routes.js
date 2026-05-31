import { Router } from "express";
import {
  getDashboardResumen,
  getProductosMasVendidos,
} from "../controllers/dashboard.controllers.js";
const router = Router();

router.get("/dashboard/resumen", getDashboardResumen);
router.get("/dashboard/productos-mas-vendidos", getProductosMasVendidos);

export default router;