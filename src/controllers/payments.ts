import { NextFunction, Request, Response } from "express";
import { PaymentSchema } from "../models/payments.model";
import { StudentSchema } from "../models/students.models";
import { revalidationTag } from "../utils/revalidate";

export const addPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { amount, purpose, remarks, note } = req.body;

  try {
    if (!amount || !purpose || !remarks) {
      res.status(400).json({ message: " Missing required field!" });
      return;
    }

    await new PaymentSchema({
      amount,
      purpose,
      remarks,
      note,
      student: id,
    }).save();

    await revalidationTag("payment");

    res.status(200).json({ message: "Payment has been added" });
  } catch (error) {
    res.status(500).json({ message: "Internal Error", error });
  }
};

export const getPaymentsByStudentId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params; // Extract student ID from request parameters

  try {
    const page = Number.parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = Number.parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const totalCount = await PaymentSchema.countDocuments({ student: id });

    const payments = await PaymentSchema.find({ student: id })
      .select("-__v") // Exclude `__v` field
      .populate([
        {
          path: "student",
          select: "first_name last_name email contact_number",
        },
      ]);

    // Always return a successful response, with an empty array if no payments found
    res.status(200).json({
      data: payments || [], // Ensure we always return an array, even if empty
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      total: totalCount,
      skip: skip,
      message:
        payments.length > 0
          ? "Payment records fetched successfully!"
          : "No payments found for this student.",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching payments",
      error,
    });
  }
};

export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const totalCount = await PaymentSchema.countDocuments({});
    const paymentData = await PaymentSchema.find({})
      .select("-__v")
      .populate([
        {
          path: "student",
          select: "first_name last_name email contact_number",
        },
        // {
        //   path: "course",
        //   select: "course_name course_duration start_date",
        // },
      ]);

    if (!paymentData) {
      res.status(404).json({ message: "data not found!" });
    }

    res.status(200).json({
      data: paymentData,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      total: totalCount,
      skip: skip,
      message: "payment data has been fetched",
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching  data",
    });
  }
};

export const deletePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const payment = await PaymentSchema.findById(id);

    if (!payment) {
      res.status(400).json({ error: "Payment not found" });
      return;
    }

    const deletePayment = await PaymentSchema.deleteOne({ _id: id });

    if (deletePayment.deletedCount === 0) {
      res.status(500).json({ error: "Failed to delete payment" });
      return;
    }

    res.status(200).json({ message: "Payment has been deleted" });
  } catch (error) {
    res.status(500).json({
      error: "An error occured while deleting payment",
    });
  }
};
