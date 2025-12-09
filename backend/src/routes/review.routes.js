import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import {
  createReview,
  deleteReview,
} from "../controllers/reviews.controller.js";
const reviewRouter = express.Router();

reviewRouter.post("/", protectedRoute, createReview);
// we did not implement this function in the mobile app - in the frontend
reviewRouter.delete("/:reviewId", protectedRoute, deleteReview);
export default reviewRouter;
