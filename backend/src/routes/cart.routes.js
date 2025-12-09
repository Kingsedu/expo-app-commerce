import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clear,
} from "../controllers/cart.controller.js";
const cartRouter = express.Router();
cartRouter.use(protectedRoute);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.put("/:productId", updateCartItem);
cartRouter.delete("/:productId", removeFromCart);
cartRouter.delete("/", clear);

export default cartRouter;
