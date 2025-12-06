import express from "express";
import { Order } from "../models/order.model.js";
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getAllOrders controllers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!["pending", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ error: "Inavlide status" });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }
    if (status === "delivered" && !order.deliveredAt) {
      order.shippedAt = new Date();
    }
    await order.save();
    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (e) {
    console.error("Error in updateOrderStatus controller:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

