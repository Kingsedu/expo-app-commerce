import express from "express";
import { User } from "../models/user.schema.js";
export const addNewAress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;
    const user = req.user;
    // this suppose to be like dis;

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }
    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault: isDefault || false,
    });
    await user.save();
    res.status(201).json({
      messsage: "Address added successfully",
      addresses: user.addresses,
    });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ addresses: user.addresses });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
      isDefault,
    } = req.body;

    const { addressId } = req.params;
    const user = req.user;
    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city || address.city;
    address.state = state || address.state;
    address.zipCode = zipCode || address.zipCode;
    address.phoneNumber = phoneNumber || address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save();
    res.status(200).json({
      message: "Address updated successfully",
      addresses: user.addresses,
    });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = req.user;
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({
      message: "Address delected successfully",
      addresses: user.addressess,
    });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: user.wishlist,
    });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(404).json({ message: "productId not available" });
    }
    if (!user.wishlist.includes(productId)) {
      return res.status(400).json({ error: "Product already in wishlist" });
    }
    const user = req.user;
    user.wishlist.pull(productId);
    await user.save();
    res
      .status(200)
      .json({ message: "product added to wishList", wishlist: user.wishlist });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await user.findById(req.user._id).populate("wishlist");
    res.status(200).json({ wishlist: user.wishlist });
  } catch (e) {
    console.error("Error in addAddress controllers:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
