import express from "express";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ error: "rating is required and must be between 1 and 5" });
    }
    const user = req.user;
    // verify if order exists and is delievered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.clerkId !== user.clerkId) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    if (order.status !== "delivered") {
      return res
        .status(400)
        .json({ error: "can only review delivered orders" });
    }
    //verify product is in the order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString()
    );
    if (!productInOrder) {
      return res
        .status(400)
        .json({ error: "Product not found in the specified order" });
    }
    //check if review already exists
    const existingReview = await Review.findOne({
      productId,
      userId: user._id,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ error: "You have already reviewed this product" });
    }

    const review = await Review.create({
      productId,
      userId: user._id,
      orderId,
      rating,
    });
    const product = await Product.findById(productId);
    if (!product) {
      // Clean up the orphaned review
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({ error: "Product not found" });
    }
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    product.averageRating = totalRating / reviews.length;
    product.totalReviews = reviews.length;

    await product.save();
    res.status(201).json({ message: "Review created successfully", review });
  } catch (e) {
    console.error("Error in createReview controller:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!reviewId) {
      return res.status(404).json({ message: "reviewId not available" });
    }
    const user = req.user;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    if (review.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }
    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (e) {
    console.error("Error in deleteReview controller:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
