"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const middleware_1 = require("../middleware/middleware");
exports.authRoute = express_1.default.Router();
exports.authRoute.post("/sign-up", middleware_1.auth, middleware_1.isSuperAdmin, auth_1.signUp);
exports.authRoute.post("/sign-in", auth_1.signIn);
exports.authRoute.get("/profile", middleware_1.auth, auth_1.getProfile);
exports.authRoute.get("/all-users", auth_1.getAllUsers);
exports.authRoute.put("/activate/:id", middleware_1.isSuperAdmin, auth_1.activateUser);
exports.authRoute.put("/deactivate/:id", middleware_1.isSuperAdmin, auth_1.deactivateUser);
exports.authRoute.post("/reset/password/:id", auth_1.resetUserPassword);
