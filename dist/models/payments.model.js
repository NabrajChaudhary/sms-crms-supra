"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchemaModel = new mongoose_1.default.Schema({
    student: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        enum: ["Admission", "Fees Installment", "Others"], // Restricting fee purpose
    },
    note: {
        type: String,
    },
    remarks: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.PaymentSchema = mongoose_1.default.model("PaymentSchema", PaymentSchemaModel);
