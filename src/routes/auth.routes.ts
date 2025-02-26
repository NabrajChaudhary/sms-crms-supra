import express from "express";
import { getProfile, signIn, signUp } from "../controllers/auth";
import { auth, isSuperAdmin } from "../middleware/middleware";

export const authRoute = express.Router();

authRoute.post("/sign-up", auth, isSuperAdmin, signUp);

authRoute.post("/sign-in", signIn);
authRoute.get("/profile", auth, getProfile);
