import mongoose from "mongoose";

const AuthSchemaModel = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact_number: {
    type: String,
  },
  avatar: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ["admin", "user", "super-admin"],
    default: "admin",
    required: true,
  },
});

export const AuthSchema = mongoose.model("AuthSchema", AuthSchemaModel);
