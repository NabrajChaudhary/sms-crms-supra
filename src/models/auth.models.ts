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
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "admin",
    required: true,
  },
});

export const AuthSchema = mongoose.model("AuthSchema", AuthSchemaModel);
