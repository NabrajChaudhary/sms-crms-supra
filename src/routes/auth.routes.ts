import express from "express";
import { signUp } from "../controllers/auth";

export const authRoute = express.Router();

authRoute.post("/sign-up", signUp);
