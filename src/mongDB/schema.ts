import mongoose from "mongoose";

const userChemas = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    birthDate: String,
    idCard: String,
    email: String,
  }
);

export const user = mongoose.model("User", userChemas);