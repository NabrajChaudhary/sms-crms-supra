import express from "express";
import {
  createStudent,
  deleteStudent,
  // generateStudentData,
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
studentRoute.get("/", auth, getAllStudents);
studentRoute.put("/update/:id", auth, updateStudent);
studentRoute.delete("/delete/:id", isSuperAdmin, deleteStudent);
studentRoute.get("/:id", auth, getStudentById);
studentRoute.put("/restore/:id", isSuperAdmin, restoreStudent);
studentRoute.put("/remove/:id", auth, removeStudent);
studentRoute.get("/archived/all", auth, isSuperAdmin, getArchivedStudents);
// // Route to generate and download student PDF
// studentRoute.get("/print/:id/pdf", (req, res, next) => {
//   // Set cache control headers to prevent caching issues
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");

//   // Call the PDF generator
//   generateStudentData(req, res, next);
// });
