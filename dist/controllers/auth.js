"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_models_1 = require("../models/auth.models");
const constant_1 = require("../config/constant");
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, contact_number } = req.body;
    try {
        if (!first_name || !last_name || !email || !password) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const user = yield auth_models_1.AuthSchema.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ message: "This email is already in use!" });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashPassword = yield bcrypt_1.default.hash(password, salt);
        yield new auth_models_1.AuthSchema({
            first_name,
            last_name,
            email,
            password: hashPassword,
            contact_number,
        }).save();
        res.status(201).json({ message: "Admin has been created!" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Error", error });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body; // Changed from req.params to req.body
    if (!email || !password) {
        res.status(400).json({ message: "Missing required fields" });
        return;
    }
    try {
        const existingUser = yield auth_models_1.AuthSchema.findOne({ email })
            .select("-__v ")
            .lean(); // Exclude password and __v from the response
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        if (!constant_1.SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined");
        }
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, constant_1.SECRET_KEY, {
            expiresIn: "48h",
        }); // Added token expiration
        res.status(200).json({
            user: existingUser,
            token,
            message: "User logged in successfully",
        });
    }
    catch (error) {
        console.error(error); // Log the error for debugging
        res
            .status(500)
            .json({ message: "Something went wrong", error: error.message }); // Simplified error response
    }
});
exports.signIn = signIn;
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    console.log("🚀 ~ userId:", userId);
    try {
        // Find the user by ID and exclude sensitive fields
        const user = yield auth_models_1.AuthSchema.findById(userId, { __v: 0, password: 0 });
        if (!user) {
            res.status(404).json({ message: "User not found" });
        }
        res
            .status(200)
            .json({ user, message: "User profile fetched successfully" });
    }
    catch (error) {
        console.log(error);
        next(error);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getProfile = getProfile;
