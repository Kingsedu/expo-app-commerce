import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { adminOnly, protectedRoute } from "../middlewares/auth.middleware.js";

const orderRoutes = express.Router();
orderRoutes.use(protectedRoute, adminOnly);

orderRoutes.get("/orders", getAllOrders);
orderRoutes.patch("/orders/:orderId/status", updateOrderStatus);

export default orderRoutes;
