import express from "express";

import {
  addPayment,
  getAllPayments,
  getPaymentsByStudentId,
} from "../controllers/payments";
import { auth } from "../middleware/middleware";

export const PaymentRoute = express.Router();

PaymentRoute.post("/:id/add-payment", auth, addPayment);
PaymentRoute.get("/all", auth, getAllPayments);
PaymentRoute.get("/:id/all", auth, getPaymentsByStudentId);
