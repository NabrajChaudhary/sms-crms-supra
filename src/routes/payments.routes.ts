import express from "express";

import {
  addPayment,
  deletePayment,
  getAllPayments,
  getPaymentsByStudentId,
} from "../controllers/payments";
import { auth, isSuperAdmin } from "../middleware/middleware";

export const PaymentRoute = express.Router();

PaymentRoute.post("/:id/add-payment", auth, addPayment);
PaymentRoute.get("/all", auth, getAllPayments);
PaymentRoute.get("/:id/all", auth, getPaymentsByStudentId);
PaymentRoute.delete("/:id/delete", isSuperAdmin, deletePayment);
