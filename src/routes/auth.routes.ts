import express from "express";
import { getProfile, signIn, signUp } from "../controllers/auth";
import auth from "../middleware/middleware";

export const authRoute = express.Router();

authRoute.post("/sign-up", signUp);
authRoute.post("/sign-in", signIn);
authRoute.get("/profile", auth, getProfile);
