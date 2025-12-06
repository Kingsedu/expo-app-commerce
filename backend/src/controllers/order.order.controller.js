import express from "express";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.user;
    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ error: "No order items" });
    }
    //validate product and stcok
    for await (const items of orderItems) {
      const product = Product.findById(items.product._id);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${items.name} not found` });
      }
      if (product.stock < items.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${product.name} ` });
      }
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    for await (const item of orderItems) {
      Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }
    res.status(201).json({ message: "order createtd successfully", order });
  } catch (e) {
    console.error("Error in createOrder controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getUserOrders = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(400).json({ message: "user not available" });
    }
    const { clerkId } = user;
    if (!clerkId) {
      return res.status(400).json({ message: "invalid user" });
    }
    const orders = (
      await Order.find({ clerkId }).populate("orderItems.product")
    ).sort({ createdAt: -1 });
    // check if each order has been reviewed

    const ordersWithReviewStatus = await Promise.all(
      orders.map(async (order) => {
        const review = await Review.findOne({ orderId: order._id });
        return {
          ...order.toObject(),
          hasReviewed: !!review,
        };
      })
    );
    res.status(200).json({ orders: ordersWithReviewStatus });
  } catch (e) {
    console.error("Error in createOrder controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
