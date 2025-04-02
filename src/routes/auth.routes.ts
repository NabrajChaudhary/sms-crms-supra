import express from "express";
import {
  activateUser,
  deactivateUser,
  getAllUsers,
  getProfile,
  resetUserPassword,
  signIn,
  signUp,
} from "../controllers/auth";
import { auth, isSuperAdmin } from "../middleware/middleware";

export const authRoute = express.Router();

authRoute.post("/sign-up", auth, isSuperAdmin, signUp);

authRoute.post("/sign-in", signIn);
authRoute.get("/profile", auth, getProfile);

authRoute.get("/all-users", getAllUsers);

authRoute.put("/activate/:id", isSuperAdmin, activateUser);
authRoute.put("/deactivate/:id", isSuperAdmin, deactivateUser);
authRoute.post("/reset/password/:id", resetUserPassword);
