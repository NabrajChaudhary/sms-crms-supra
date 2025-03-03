"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allActiveCourse = exports.activeCourse = exports.deactiveCourse = exports.getAllCourse = exports.deleteCourse = exports.createCourse = void 0;
const courses_model_1 = require("../models/courses.model");
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { course_name, start_date, course_duration, course_slug } = req.body;
    try {
        if (!course_name || !course_duration || !course_slug) {
            res.status(400).json({ message: "Missing required field!" });
            return;
        }
        const course = yield courses_model_1.CourseSchema.findOne({
            course_slug: req.body.course_slug,
        });
        if (course) {
            res.status(400).json({ message: "This course slug already exists" });
            return;
        }
        yield new courses_model_1.CourseSchema({
            course_name,
            course_slug,
            course_duration,
            start_date,
        }).save();
        res.status(201).json({ message: "Course has been added!" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Error", error });
    }
});
exports.createCourse = createCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const course = yield courses_model_1.CourseSchema.findById(id);
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }
        if (course.isActive) {
            res
                .status(400)
                .json({ error: "Course must be deactivated before deletion" });
            return;
        }
        const deleteCourse = yield courses_model_1.CourseSchema.deleteOne({ _id: id });
        if (deleteCourse.deletedCount === 0) {
            res.status(500).json({ error: "Failed to delete Course" });
            return;
        }
        res.status(200).json({ message: "Course has been deleted" });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while deleting student data",
        });
    }
});
exports.deleteCourse = deleteCourse;
const getAllCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        // Fetch total students count for pagination metadata
        const totalCount = yield courses_model_1.CourseSchema.countDocuments({});
        const coursesData = yield courses_model_1.CourseSchema.find({}).select("-__v");
        if (!coursesData) {
            res.status(404).json({ message: "Courses data not found!" });
        }
        res.status(200).json({
            data: coursesData,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "Courses has been fetched",
        });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching student data",
        });
    }
});
exports.getAllCourse = getAllCourse;
function updateCourseActiveStatus(id, shouldActive) {
    return __awaiter(this, void 0, void 0, function* () {
        const course = yield courses_model_1.CourseSchema.findById(id);
        if (!course) {
            return { success: false, message: "Course not found" };
        }
        if (course.isActive === shouldActive) {
            const status = shouldActive ? "activated" : "deactivated";
            return { success: true, message: `Course is already ${status}` };
        }
        course.isActive = shouldActive;
        yield course.save();
        const action = shouldActive ? "activated" : "deactivated";
        return { success: true, message: `Course has been ${action}` };
    });
}
const deactiveCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateCourseActiveStatus(id, false);
        if (!result.success) {
            res.status(400).json({ error: result.message });
        }
        else {
            res.status(200).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while removing student data",
        });
    }
});
exports.deactiveCourse = deactiveCourse;
const activeCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateCourseActiveStatus(id, true);
        if (!result.success) {
            res.status(400).json({ error: result.message });
        }
        else {
            res.status(200).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while removing student data",
        });
    }
});
exports.activeCourse = activeCourse;
const allActiveCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        // Fetch total students count for pagination metadata
        const totalCount = yield courses_model_1.CourseSchema.countDocuments({ isActive: true });
        const courseData = yield courses_model_1.CourseSchema.find({ isActive: true })
            .sort({ first_name: 1 })
            .select("-__v");
        if (!courseData) {
            res.status(404).json({ message: "Courses not found!" });
        }
        res.status(200).json({
            data: courseData,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "Courses has been fetched",
        });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching Courses ",
        });
    }
});
exports.allActiveCourse = allActiveCourse;
