"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../config/constant");
const extractToken = (authHeader) => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }
    return authHeader.split(" ")[1];
};
const verifyAndDecodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, constant_1.SECRET_KEY);
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
};
const handleUnauthorized = (res) => {
    return res.status(401).json({ message: "Unauthorized User" });
};
const auth = (req, res, next) => {
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
    req.userId = decodedToken.id;
    req.role = decodedToken.role;
    next();
};
exports.auth = auth;
const isSuperAdmin = (req, res, next) => {
    (0, exports.auth)(req, res, () => {
        if (req.role !== "super-admin") {
            res.status(403).json({ message: "Permission Denied" });
            return;
        }
        next();
    });
};
exports.isSuperAdmin = isSuperAdmin;
