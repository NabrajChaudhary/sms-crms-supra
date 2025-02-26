import { Secret } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { SECRET_KEY } from "../config/constant";

interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

const extractToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const verifyAndDecodeToken = (token: string): jwt.JwtPayload | null => {
  try {
    return jwt.verify(token, SECRET_KEY as Secret) as jwt.JwtPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

const handleUnauthorized = (res: Response): Response => {
  return res.status(401).json({ message: "Unauthorized User" });
};

export const auth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    handleUnauthorized(res);
    return;
  }

  const decodedToken = verifyAndDecodeToken(token);

  if (!decodedToken) {
    handleUnauthorized(res);
    return;
  }

  req.userId = decodedToken.id as string;
  req.role = decodedToken.role as string;

  next();
};

export const isSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  auth(req, res, () => {
    if (req.role !== "sup_admin") {
      res.status(403).json({ message: "Permission Denied" });
      return;
    }
    next();
  });
};
