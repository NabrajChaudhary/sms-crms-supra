"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_API_SECRET_KEY = exports.CLOUD_NAME = exports.PASSWORD = exports.EMAIL = exports.SECRET_KEY = exports.DB_URI = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
exports.DB_URI = process.env.DB_URI;
exports.SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.EMAIL = process.env.email;
exports.PASSWORD = process.env.password;
exports.CLOUD_NAME = process.env.cloud_name;
exports.CLOUDINARY_API_SECRET_KEY = process.env.CLOUDINARY_API_SECRET_KEY;
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
// export const { PORT = 8000 } = process.env;
