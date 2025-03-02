import mongoose, { Schema } from "mongoose";

const historySchema = new mongoose.Schema({
  username: String,
  password: String,
  tokens: String,
});

export const history = mongoose.model("history", historySchema);
