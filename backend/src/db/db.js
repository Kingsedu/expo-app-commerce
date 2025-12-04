import mongoose from "mongoose";

export const connectDataBase = (url) => {
  try {
    if (!url) {
      throw Error("Database URL is required");
    }

    const result = mongoose.connect(url);
    console.log("connected to database successful");

    return result;
  } catch (e) {
    console.error(e);
  }
};
