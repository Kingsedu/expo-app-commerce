import express from "express";
import { getAllProducts } from "../controllers/admin.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { getProductById } from "../controllers/product.controller.js";

const productRoute = express.Router();

productRoute.get("/", protectedRoute, getAllProducts);
productRoute.get("/:id", protectedRoute, getProductById);

export default productRoute;
