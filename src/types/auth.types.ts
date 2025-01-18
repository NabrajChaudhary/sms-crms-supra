import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { NextFunction, Request, Response } from "express";

export type UserType = {
  _id: Types.ObjectId;
  email: string;
  password: string;
};

export interface AuthRequest extends Request {
  userId?: JwtPayload;
}
