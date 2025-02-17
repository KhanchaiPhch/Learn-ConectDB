import mongoose, { Schema } from "mongoose";

const authSchema = new mongoose.Schema({
    username: String,
    password: String,
    exp : String
})

export const auth = mongoose.model('Auth', authSchema)