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
exports.getAllPayments = exports.getPaymentsByStudentId = exports.addPayment = void 0;
const payments_model_1 = require("../models/payments.model");
const addPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { amount, purpose, remarks } = req.body;
    try {
        if (!amount || !purpose || !remarks) {
            res.status(400).json({ message: " Missing required field!" });
            return;
        }
        yield new payments_model_1.PaymentSchema({
            amount,
            purpose,
            remarks,
            student: id,
        }).save();
        res.status(400).json({ message: "Payment has been added" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Error", error });
    }
});
exports.addPayment = addPayment;
const getPaymentsByStudentId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Extract student ID from request parameters
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        const totalCount = yield payments_model_1.PaymentSchema.countDocuments({ student: id });
        const payments = yield payments_model_1.PaymentSchema.find({ student: id })
            .select("-__v") // Exclude `__v` field
            .populate({
            path: "student",
            select: "first_name last_name email contact_number",
        });
        if (!payments || payments.length === 0) {
            res.status(404).json({ message: "No payments found for this student!" });
            return;
        }
        res.status(200).json({
            data: payments,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "Payment records fetched successfully!",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching payments",
            error,
        });
    }
});
exports.getPaymentsByStudentId = getPaymentsByStudentId;
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        const totalCount = yield payments_model_1.PaymentSchema.countDocuments({});
        const paymentData = yield payments_model_1.PaymentSchema.find({})
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .populate([
            {
                path: "student",
                select: "first_name last_name email contact_number",
            },
        ]);
        if (!paymentData) {
            res.status(404).json({ message: "data not found!" });
        }
        res.status(200).json({
            data: paymentData,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "payment data has been fetched",
        });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching  data",
        });
    }
});
exports.getAllPayments = getAllPayments;
