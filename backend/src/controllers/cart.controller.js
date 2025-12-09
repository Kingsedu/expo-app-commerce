import express from "express";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ clerkId: req.user?.clerkId }).populate(
      "items.product"
    );
    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    res.status(200).json({ cart });
  } catch (e) {
    console.error("Error in getCart controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    // validate product exitts and has stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).josn({ error: "Insufficient stock" });
    }
    let cart = await Cart.findOne({ clerkId: req.user?.clerkId });
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      const newQuantity = existingItem.quantity + 1;
      if (product.stock < newQuantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
  } catch (e) {
    console.error("Error in addToCart controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ clerkId: req.user?.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ error: "Product not in cart" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart item updated successfully", cart }); //--- ADDED ---
  } catch (e) {
    console.error("Error in updateCartItem controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ clerkId: req.user?.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (e) {
    console.error("Error in removeFromCart controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const clear = async (req, res) => {
  try {
    const cart = await Cart.findOne({ clerkId: req.user?.clerkId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (e) {
    console.error("Error in clear controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
