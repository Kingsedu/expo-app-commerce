import express from "express";
import {
  addNewAress,
  deleteAddress,
  getAddresses,
  updateAddress,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();
userRouter.use(protectedRoute);

//address routes
userRouter.post("/addresses", addNewAress);
userRouter.get("/addresses", getAddresses);
userRouter.put("/addresses/:addressId", updateAddress);
userRouter.delete("/addresses/:addressId", deleteAddress);

//wishList routes
userRouter.post("/wishlist", addToWishlist);
userRouter.delete("/wishlist/:productId", removeFromWishlist);
userRouter.get("/wishlist", getWishlist);

export default userRouter;
