import express from "express";
import { Product } from "../models/product.model.js";
import cloudinary from "../configs/cloudinary.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.schema.js";
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }
    // this is new
    if (req.files.length > 3) {
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }
    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });
    const uploadResult = await Promise.all(uploadPromises);
    const imageUrls = uploadResult.map((result) => result.secure_url);
    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });
    res.status(201).json(product);
  } catch (e) {
    console.error("Error creating product", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (_, res) => {
  try {
    // -1 means in desc order: most recent products first
    const products = (await Product.find()).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (e) {
    console.error("Error creating product", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ messsage: "Product not found" });
    }
    if (name) {
      product.name = name;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = parseFloat(price);
    }
    if (stock !== undefined) {
      product.stock = parseInt(stock);
    }
    if (category) {
      product.category = category;
    }

    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximun 3 images allowed" });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });
      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }
    await product.save();
    res.status(200).json(product);
  } catch (e) {
    console.error("Error creating product", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ customers });
  } catch (e) {
    console.error("error fetching custormers", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const totalCustomers = await User.countDocuments();
    const totalProducts = await User.countDocuments();

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
    });
  } catch (e) {
    console.error("error fetching custormers", e);
    res.status(500).json({ message: "Internal server error" });
  }
};
