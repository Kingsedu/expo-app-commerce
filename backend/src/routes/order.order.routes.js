import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getUserOrders,
} from "../controllers/order.order.controller.js";
const order_orderRouter = Router();

order_orderRouter.post("/", protectedRoute, createOrder);
order_orderRouter.get("/", protectedRoute, getUserOrders);

export default order_orderRouter;
