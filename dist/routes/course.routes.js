"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRoute = void 0;
const express_1 = __importDefault(require("express"));
const courses_1 = require("../controllers/courses");
exports.courseRoute = express_1.default.Router();
exports.courseRoute.post("/create", courses_1.createCourse);
exports.courseRoute.get("/", courses_1.getAllCourse);
exports.courseRoute.delete("/delete/:id", courses_1.deleteCourse);
exports.courseRoute.put("/activate/:id", courses_1.activeCourse);
exports.courseRoute.put("/deactivate/:id", courses_1.deactiveCourse);
exports.courseRoute.get("/all", courses_1.allActiveCourse);
