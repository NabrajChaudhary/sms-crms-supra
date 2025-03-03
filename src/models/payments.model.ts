import mongoose from "mongoose";

const PaymentSchemaModel = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentSchema", // Assuming you have a Student model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [100, "Amount must be at least 100 Rs"], // Ensuring minimum 100 Rs
    },
    purpose: {
      type: String,
      required: true,
      enum: ["admission", "due", "installment", "others"], // Restricting fee purpose
    },
    remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentSchema = mongoose.model(
  "PaymentSchema",
  PaymentSchemaModel
);
