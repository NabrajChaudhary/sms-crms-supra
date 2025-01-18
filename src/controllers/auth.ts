import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { NextFunction, Request, Response } from "express";
import { AuthSchema } from "../models/auth.models";
import { SECRET_KEY } from "../config/constant";
import { AuthRequest, UserType } from "../types/auth.types";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { first_name, last_name, email, password, contact_number } = req.body;

  try {
    if (!first_name || !last_name || !email || !password) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await AuthSchema.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ message: "This email is already in use!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    await new AuthSchema({
      first_name,
      last_name,
      email,
      password: hashPassword,
      contact_number,
    }).save();

    res.status(201).json({ message: "Admin has been created!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Error", error });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body; // Changed from req.params to req.body

  if (!email || !password) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  try {
    const existingUser: UserType | null = await AuthSchema.findOne({ email })
      .select("-__v ")
      .lean(); // Exclude password and __v from the response

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    if (!SECRET_KEY) {
      throw new Error("SECRET_KEY is not defined");
    }
    const token: string = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
      expiresIn: "48h",
    }); // Added token expiration

    res.status(200).json({
      user: existingUser,
      token,
      message: "User logged in successfully",
    });
  } catch (error: any) {
    console.error(error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message }); // Simplified error response
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.userId;
  console.log("🚀 ~ userId:", userId);

  try {
    // Find the user by ID and exclude sensitive fields
    const user = await AuthSchema.findById(userId, { __v: 0, password: 0 });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ user, message: "User profile fetched successfully" });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
