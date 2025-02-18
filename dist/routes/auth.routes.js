"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const middleware_1 = __importDefault(require("../middleware/middleware"));
exports.authRoute = express_1.default.Router();
exports.authRoute.post("/sign-up", auth_1.signUp);
exports.authRoute.post("/sign-in", auth_1.signIn);
exports.authRoute.get("/profile", middleware_1.default, auth_1.getProfile);
