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
exports.resetUserPassword = exports.activateUser = exports.deactivateUser = exports.getAllUsers = exports.getProfile = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_models_1 = require("../models/auth.models");
const constant_1 = require("../config/constant");
const coreFunctions_1 = require("../utils/coreFunctions");
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
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
        const token = jsonwebtoken_1.default.sign({ id: existingUser._id, role: existingUser.role }, constant_1.SECRET_KEY, {
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
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        // Fetch total students count for pagination metadata
        const totalCount = yield auth_models_1.AuthSchema.countDocuments({ role: "admin" });
        const allUsers = yield auth_models_1.AuthSchema.find({ role: "admin" }).select("-__v -password");
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
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching users",
        });
    }
});
exports.getAllUsers = getAllUsers;
function updateUserArchiveStatus(id, shouldActive) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield auth_models_1.AuthSchema.findById(id);
        if (!user) {
            return { success: false, message: "User data not found" };
        }
        if (user.isActive === shouldActive) {
            const status = shouldActive ? "active" : "deactived";
            return { success: false, message: `User is already ${status}` };
        }
        user.isActive = shouldActive;
        yield user.save();
        const action = shouldActive ? "active" : "deactived";
        return { success: true, message: `User has been ${action}!` };
    });
}
const deactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateUserArchiveStatus(id, false);
        if (!result.success) {
            res.status(400).json({ error: result.message });
        }
        else {
            res.status(200).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while disabling user",
        });
    }
});
exports.deactivateUser = deactivateUser;
const activateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateUserArchiveStatus(id, true);
        if (!result.success) {
            res.status(400).json({ error: result.message });
        }
        else {
            res.status(200).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while activating user",
        });
    }
});
exports.activateUser = activateUser;
const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log("🚀 ~ id:", id);
    try {
        const user = yield auth_models_1.AuthSchema.findById(id);
        console.log("🚀 ~ resetUser ~ user:", user);
        console.log((0, coreFunctions_1.generatePassword)());
        if (!user) {
            res.status(404).json({ message: "This email has no user!" });
        }
    }
    catch (error) { }
});
exports.resetUserPassword = resetUserPassword;
