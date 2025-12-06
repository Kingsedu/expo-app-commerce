import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProducts,
  getAllCustomers,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { adminOnly, protectedRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const adminRouter = express.Router();
//something actuall very new;// before you run this methods. run all that middleware in that order
adminRouter.use(protectedRoute, adminOnly);
adminRouter.post("/products", upload.array("images", 3), createProduct);

adminRouter.get("/products", getAllProducts);
adminRouter.put("/products/:id", upload.array("images", 3), updateProducts);

adminRouter.get("/custormers", getAllCustomers);
adminRouter.get("/stats", getDashboardStats);

export default adminRouter;
