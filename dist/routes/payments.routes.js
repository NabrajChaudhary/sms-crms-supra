"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoute = void 0;
const express_1 = __importDefault(require("express"));
const payments_1 = require("../controllers/payments");
const middleware_1 = require("../middleware/middleware");
exports.PaymentRoute = express_1.default.Router();
exports.PaymentRoute.post("/:id/add-payment", middleware_1.auth, payments_1.addPayment);
exports.PaymentRoute.get("/all", middleware_1.auth, payments_1.getAllPayments);
exports.PaymentRoute.get("/:id/all", middleware_1.auth, payments_1.getPaymentsByStudentId);
