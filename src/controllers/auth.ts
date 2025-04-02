import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { NextFunction, Request, Response } from "express";
import { AuthSchema } from "../models/auth.models";
import { SECRET_KEY } from "../config/constant";
import { AuthRequest, UserType } from "../types/auth.types";
import { generatePassword } from "../utils/coreFunctions";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    next(error);
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

    const token: string = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      SECRET_KEY,
      {
        expiresIn: "48h",
      }
    ); // Added token expiration

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

export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch total students count for pagination metadata
    const totalCount = await AuthSchema.countDocuments({ role: "admin" });

    const allUsers = await AuthSchema.find({ role: "admin" }).select(
      "-__v -password"
    );

    if (!allUsers) {
      res.status(404).json({ message: "No students found!" });
      return;
    }
    res.status(200).json({
      data: allUsers,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      total: totalCount,
      skip: skip,
      message: "Users have been fetched",
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching users",
    });
  }
};

interface UsersUpdateResult {
  success: boolean;
  message: string;
}

async function updateUserArchiveStatus(
  id: string,
  shouldActive: boolean
): Promise<UsersUpdateResult> {
  const user = await AuthSchema.findById(id);

  if (!user) {
    return { success: false, message: "User data not found" };
  }

  if (user.isActive === shouldActive) {
    const status = shouldActive ? "active" : "deactived";
    return { success: false, message: `User is already ${status}` };
  }

  user.isActive = shouldActive;
  await user.save();

  const action = shouldActive ? "active" : "deactived";
  return { success: true, message: `User has been ${action}!` };
}

export const deactivateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateUserArchiveStatus(id, false);

    if (!result.success) {
      res.status(400).json({ error: result.message });
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while disabling user",
    });
  }
};

export const activateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateUserArchiveStatus(id, true);

    if (!result.success) {
      res.status(400).json({ error: result.message });
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while activating user",
    });
  }
};

export const resetUserPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  console.log("🚀 ~ id:", id);

  try {
    const user = await AuthSchema.findById(id);
    console.log("🚀 ~ resetUser ~ user:", user);
    console.log(generatePassword());
    if (!user) {
      res.status(404).json({ message: "This email has no user!" });
    }
  } catch (error) {}
};
