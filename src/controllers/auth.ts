import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { Request, Response } from "express";
import { AuthSchema } from "../models/auth.models";

// export const signUp = async (req: Request, res: Response):Promise<void> => {
//   const { first_name, last_name, email, password, contact_number } = req.body;
//   try {
//     if (!first_name || !last_name || !email || !password) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const user = await AuthSchema.findOne({ email: req.body.email });
//     if (user) {
//       return res
//         .status(400)
//         .send({ message: "This emails is already in use!!" });
//     }

//     const salt = await bcrypt.genSalt(Number(10));

//     const hashPassword = await bcrypt.hash(req.body.password, salt);
//     await new AuthSchema({
//       ...req.body,
//       password: hashPassword,
//     }).save();
//     res.status(201).json({ message: "Admin has been created!" });
//   } catch (error) {
//     res.status(500).send({ message: "Internal Error", error });
//   }
// };

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
