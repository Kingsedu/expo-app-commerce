import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { ENV } from "./configs/env.js";
import { connectDataBase } from "./db/db.js";
import { clerkMiddleware } from "@clerk/express";
dotenv.config();
const app = express();
app.use(clerkMiddleware());
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
