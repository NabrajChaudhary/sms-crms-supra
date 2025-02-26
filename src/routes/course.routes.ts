import express from "express";

import {
  createCourse,
  getAllCourse,
  activeCourse,
  deactiveCourse,
  deleteCourse,
  allActiveCourse,
} from "../controllers/courses";

export const courseRoute = express.Router();

courseRoute.post("/create", createCourse);
courseRoute.get("/", getAllCourse);
courseRoute.delete("/delete/:id", deleteCourse);
courseRoute.put("/activate/:id", activeCourse);
courseRoute.put("/deactivate/:id", deactiveCourse);
courseRoute.get("/all", allActiveCourse);
