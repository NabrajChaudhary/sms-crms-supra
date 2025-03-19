import express from "express";
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getArchivedStudents,
  getStudentById,
  removeStudent,
  restoreStudent,
  updateStudent,
} from "../controllers/students";
import { auth, isSuperAdmin } from "../middleware/middleware";

export const studentRoute = express.Router();

studentRoute.post("/create", auth, createStudent);
studentRoute.get("/", getAllStudents);
studentRoute.put("/update/:id", auth, updateStudent);
studentRoute.delete("/delete/:id", deleteStudent);
studentRoute.get("/:id", getStudentById);
studentRoute.put("/restore/:id", restoreStudent);
studentRoute.put("/remove/:id", removeStudent);
studentRoute.get("/archived/all", auth, isSuperAdmin, getArchivedStudents);
