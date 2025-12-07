import express from "express";
import { Product } from "../models/product.model.js";

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (e) {
    console.error("Error fetching product by ID", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
