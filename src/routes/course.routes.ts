import express from "express";

import {
  createCourse,
  getAllCourse,
  activeCourse,
  deactiveCourse,
  deleteCourse,
  allActiveCourse,
} from "../controllers/courses";
import { auth } from "../middleware/middleware";

export const courseRoute = express.Router();

courseRoute.post("/create", auth, createCourse);
courseRoute.get("/", auth, getAllCourse);
courseRoute.delete("/delete/:id", auth, deleteCourse);
courseRoute.put("/activate/:id", auth, activeCourse);
courseRoute.put("/deactivate/:id", auth, deactiveCourse);
courseRoute.get("/all", allActiveCourse);
