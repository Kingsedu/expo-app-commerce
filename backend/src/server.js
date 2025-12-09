import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { ENV } from "./configs/env.js";
import { connectDataBase } from "./db/db.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./configs/inngest.js";
import adminRouter from "./routes/admin.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRouter from "./routes/user.routes.js";
import order_orderRouter from "./routes/order.order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import productRoute from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import cors from "cors";
dotenv.config();
const app = express();
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
// credenttials : true allows the browser to send the cookies to tthe server with the reques
app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under the req => req.auth
app.use("/api/inngest", serve({ client: inngest, functions }));
const __dirname = path.resolve();
console.log(path.join(__dirname, "../admin"));
console.log(path.join(__dirname, "../admin", "dist", "index.html"));
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "succefull" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  const staticPath = path.join(__dirname, "../admin/dist");
  app.use(express.static(staticPath));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
app.use("/api/admin", adminRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRouter);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRouter);

const startServer = async () => {
  try {
    await connectDataBase(ENV.DB_URL);
    app.listen(ENV.PORT, () => {
      console.log(`server is running http://localhost:${ENV.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
