import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { SECRET_KEY } from "../config/constant";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";

const auth = (req: AuthRequest, res: Response, next: NextFunction): any => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer")) {
      // Unauthorized if token is missing or doesn't start with 'Bearer'
      return res.status(401).json({ message: "Unauthorized User" });
    }

    // Verify and decode the token
    const tokenWithoutBearer = token.split(" ")[1];

    const decodedToken = jwt.verify(tokenWithoutBearer, SECRET_KEY as Secret);

    if (!decodedToken) {
      // Unauthorized if token cannot be verified
      return res.status(401).json({ message: "Unauthorized User" });
    }

    // Store user ID in request object for future use
    req.userId = (decodedToken as any).id;
    next(); // Move to the next middleware/route handler
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    // Unauthorized if any error occurs during token verification
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

export default auth;
