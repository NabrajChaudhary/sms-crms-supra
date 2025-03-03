"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPayment = void 0;
const payment_model_1 = require("../models/payment.model");
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { student_id } = req.params;
    const { amount, purpose, remarks } = req.body;
    try {
        if (!amount || !purpose || !remarks) {
            res.status(400).json({ message: " Missing required field!" });
            return;
        }
        yield new payment_model_1.PaymentSchema({
            amount,
            purpose,
            remarks,
            studentId: student_id,
        }).save();
        res.status(400).json({ message: "Payment has been added" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Error", error });
    }
});
exports.addPayment = addPayment;
