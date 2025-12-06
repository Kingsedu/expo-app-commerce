import express from "express";
import { User } from "../models/user.schema.js";
import { ENV } from "../configs/env.js";
import { requireAuth } from "@clerk/express";

export const protectedRoute = () => {
  (requireAuth(),
    async (req, res, next) => {
      try {
        if (!req.auth) {
          console.log("something went wrong from the clerk authentication");
          return res.status(401).json({ message: "Unauthorized-invalid....." });
        }
        const clerkId = req.auth?.userId;
        if (!clerkId) {
          return res.status(401).json({ message: "Unauthorized-invalid....." });
        }
        const user = await User.findOne({ clerkId });
        if (!user) {
          return res.status(404).json({ message: "User not Found" });
        }
        req.user = user;
        next();
      } catch (e) {
        console.error("Error in ProtectedRoute middleware", e);
        res.status(500).json({ message: "Internal server error" });
      }
    });
};

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized admin access only" });
  }
  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Unauthorized- admin access only" });
  }
  next();
};
