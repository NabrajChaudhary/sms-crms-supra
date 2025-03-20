"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRoute = void 0;
const express_1 = __importDefault(require("express"));
const students_1 = require("../controllers/students");
const middleware_1 = require("../middleware/middleware");
exports.studentRoute = express_1.default.Router();
exports.studentRoute.post("/create", middleware_1.auth, students_1.createStudent);
exports.studentRoute.get("/", middleware_1.auth, students_1.getAllStudents);
exports.studentRoute.put("/update/:id", middleware_1.auth, students_1.updateStudent);
exports.studentRoute.delete("/delete/:id", middleware_1.isSuperAdmin, students_1.deleteStudent);
exports.studentRoute.get("/:id", middleware_1.auth, students_1.getStudentById);
exports.studentRoute.put("/restore/:id", middleware_1.isSuperAdmin, students_1.restoreStudent);
exports.studentRoute.put("/remove/:id", middleware_1.auth, students_1.removeStudent);
exports.studentRoute.get("/archived/all", middleware_1.auth, middleware_1.isSuperAdmin, students_1.getArchivedStudents);
exports.studentRoute.get("/print/:id", middleware_1.auth, students_1.generateStudentData);
