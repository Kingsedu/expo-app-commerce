import { Inngest } from "inngest";
import { ENV } from "./env.js";
import { connectDataBase } from "../db/db.js";
import { User } from "../models/user.schema.js";
export const inngest = new Inngest({ id: "ecommerce-app" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDataBase(ENV.DB_URL);
      const { id, email_addresses, first_name, last_name, image_url } =
        event.data;

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url,
        addresses: [],
        wishlist: [],
      };

      await User.create(newUser);
    } catch (error) {
      console.error("Failed to sync user:", error);
      throw error;
    }
  }
);

const deleteUser = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDataBase(ENV.DB_URL);
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);
export const functions = [syncUser, deleteUser];
