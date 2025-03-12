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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArchivedStudents = exports.getStudentById = exports.deleteStudent = exports.restoreStudent = exports.removeStudent = exports.updateStudent = exports.getAllStudents = exports.createStudent = void 0;
const students_models_1 = require("../models/students.models");
const upload_1 = __importDefault(require("../utils/upload"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const revalidate_1 = require("../utils/revalidate");
const createStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        upload_1.default.single("image")(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err instanceof multer_1.default.MulterError) {
                return res.status(400).json({ message: "File upload error" });
            }
            else if (err) {
                return res.status(500).json({ message: "Internal server error" });
            }
            const { first_name, last_name, address, course, guardain_name, emergency_contact_number, emergency_contact_name, date_of_enroll, email, contact_number, gender, date_of_birth, refered_by, } = req.body;
            const imagePath = req.file ? req.file.path : "";
            const upload = yield (0, cloudinary_1.default)(imagePath);
            if (!first_name ||
                !last_name ||
                !email ||
                !course ||
                !guardain_name ||
                !date_of_enroll ||
                !contact_number ||
                !emergency_contact_name ||
                !emergency_contact_number ||
                !date_of_birth ||
                !gender) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const student = yield students_models_1.StudentSchema.findOne({
                email: req.body.email,
                contact_number: req.body.contact_number,
            });
            if (student) {
                res.status(400).json({ message: "This details are already in use!" });
                return;
            }
            yield new students_models_1.StudentSchema({
                first_name,
                last_name,
                address,
                course,
                guardain_name,
                emergency_contact_number,
                emergency_contact_name,
                date_of_enroll,
                email,
                contact_number,
                entry_by: userId,
                gender,
                date_of_birth,
                refered_by,
                image: upload === null || upload === void 0 ? void 0 : upload.secure_url,
            }).save();
            yield (0, revalidate_1.revalidationTag)("student");
            res.status(201).json({ message: "Student has been added!" });
        }));
    }
    catch (error) {
        next;
        res.status(500).json({ message: "Internal Error", error });
    }
});
exports.createStudent = createStudent;
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        // Fetch total students count for pagination metadata
        const totalCount = yield students_models_1.StudentSchema.countDocuments({
            isArchived: false,
        });
        const studentData = yield students_models_1.StudentSchema.find({ isArchived: false })
            .sort({ first_name: 1 })
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .populate([
            {
                path: "course",
                select: "course_name course_slug course_duration start_date ",
            },
            {
                path: "entry_by",
                select: "first_name last_name",
            },
        ]);
        if (!studentData) {
            res.status(404).json({ message: "No students found!" });
            return;
        }
        res.status(200).json({
            data: studentData,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "Students have been fetched",
        });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching student data",
        });
    }
});
exports.getAllStudents = getAllStudents;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updatedStudentData = req.body;
    try {
        const updateStudent = yield students_models_1.StudentSchema.findByIdAndUpdate(id, updatedStudentData, { new: true });
        if (!updateStudent) {
            res.status(404).json({ error: "Student data not found" });
        }
        res.status(200).json({ message: "Student has been updated!" });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while updating student data",
        });
    }
});
exports.updateStudent = updateStudent;
function updateStudentArchiveStatus(id, shouldArchive) {
    return __awaiter(this, void 0, void 0, function* () {
        const student = yield students_models_1.StudentSchema.findById(id);
        if (!student) {
            return { success: false, message: "Student data not found" };
        }
        if (student.isArchived === shouldArchive) {
            const status = shouldArchive ? "archived" : "active";
            return { success: false, message: `Student is already ${status}` };
        }
        student.isArchived = shouldArchive;
        yield student.save();
        const action = shouldArchive ? "removed" : "restored";
        return { success: true, message: `Student has been ${action}!` };
    });
}
const removeStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateStudentArchiveStatus(id, true);
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
exports.removeStudent = removeStudent;
const restoreStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield updateStudentArchiveStatus(id, false);
        if (!result.success) {
            res.status(400).json({ error: result.message });
        }
        else {
            res.status(200).json({ message: result.message });
        }
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while restoring student data",
        });
    }
});
exports.restoreStudent = restoreStudent;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const student = yield students_models_1.StudentSchema.findById(id);
        if (!student) {
            res.status(404).json({ error: "Student not found" });
            return;
        }
        if (!student.isArchived) {
            res
                .status(400)
                .json({ error: "Student must be archived before deletion" });
            return;
        }
        const deleteResult = yield students_models_1.StudentSchema.deleteOne({ _id: id });
        if (deleteResult.deletedCount === 0) {
            res.status(500).json({ error: "Failed to delete student" });
            return;
        }
        res.status(200).json({ message: "Student has been permanently deleted" });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while deleting student data",
        });
    }
});
exports.deleteStudent = deleteStudent;
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const studentData = yield students_models_1.StudentSchema.findById(id, { __v: 0 }).populate([
            {
                path: "course",
                select: "course_name course_slug course_duration start_date ",
            },
            {
                path: "entry_by",
                select: "first_name last_name",
            },
        ]);
        if (!studentData) {
            res.status(404).json({ message: "Student data not found!" });
        }
        res
            .status(200)
            .json({ data: studentData, message: "Student has been fetched!" });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occured while fetching student data",
        });
    }
});
exports.getStudentById = getStudentById;
const getArchivedStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
        const skip = (page - 1) * limit; // Calculate the number of documents to skip
        // Fetch total students count for pagination metadata
        const totalCount = yield students_models_1.StudentSchema.countDocuments({
            isArchived: true,
        });
        const studentData = yield students_models_1.StudentSchema.find({ isArchived: true })
            .sort({ first_name: 1 })
            .select("-__v")
            .populate([
            {
                path: "course",
                select: "course_name course_slug course_duration start_date ",
            },
            {
                path: "entry_by",
                select: "first_name last_name",
            },
        ]);
        if (!studentData) {
            res.status(404).json({ message: "Student data not found!" });
        }
        res.status(200).json({
            data: studentData,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            total: totalCount,
            message: "Students has been fetched",
        });
    }
    catch (error) {
        res.status(500).json({
            error: "An error occurred while fetching student data",
        });
    }
});
exports.getArchivedStudents = getArchivedStudents;
