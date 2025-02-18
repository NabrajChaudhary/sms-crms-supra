"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../config/constant");
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer")) {
            // Unauthorized if token is missing or doesn't start with 'Bearer'
            return res.status(401).json({ message: "Unauthorized User" });
        }
        // Verify and decode the token
        const tokenWithoutBearer = token.split(" ")[1];
        const decodedToken = jsonwebtoken_1.default.verify(tokenWithoutBearer, constant_1.SECRET_KEY);
        if (!decodedToken) {
            // Unauthorized if token cannot be verified
            return res.status(401).json({ message: "Unauthorized User" });
        }
        // Store user ID in request object for future use
        req.userId = decodedToken.id;
        next(); // Move to the next middleware/route handler
    }
    catch (error) {
        console.error("Error in authentication middleware:", error);
        // Unauthorized if any error occurs during token verification
        return res.status(401).json({ message: "Unauthorized User" });
    }
};
exports.default = auth;
