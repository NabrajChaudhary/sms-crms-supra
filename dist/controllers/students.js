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
exports.getArchivedStudents = exports.getStudentById = exports.deleteStudent = exports.restoreStudent = exports.removeStudent = exports.getAllStudents = exports.updateStudent = exports.createStudent = void 0;
const students_models_1 = require("../models/students.models");
const upload_1 = __importDefault(require("../utils/upload"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const revalidate_1 = require("../utils/revalidate");
const payments_model_1 = require("../models/payments.model");
const mongoose_1 = require("mongoose");
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
            const { first_name, last_name, address, course, guardain_name, emergency_contact_number, emergency_contact_name, date_of_enroll, email, contact_number, gender, date_of_birth, refered_by, school_name, } = req.body;
            const imagePath = req.file ? req.file.path : "";
            const upload = yield (0, cloudinary_1.default)(imagePath);
            if (!first_name ||
                !last_name ||
                !course ||
                !guardain_name ||
                !date_of_enroll ||
                !contact_number ||
                !emergency_contact_name ||
                !emergency_contact_number ||
                !date_of_birth ||
                !gender ||
                !school_name) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const student = yield students_models_1.StudentSchema.findOne({
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
                school_name,
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
const updateStudent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params;
    try {
        // Check if the ID is valid
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid student ID format" });
        }
        // Create a new ObjectId from the id string instead of reassigning
        const studentObjectId = new mongoose_1.Types.ObjectId(id);
        // Wrap multer file upload in a Promise for handling file
        yield new Promise((resolve, reject) => {
            upload_1.default.single("image")(req, res, (err) => {
                if (err) {
                    if (err instanceof multer_1.default.MulterError) {
                        reject(new Error(`File upload error: ${err.message}`));
                    }
                    else {
                        reject(new Error(`Internal server error: ${err.message}`));
                    }
                }
                else {
                    resolve();
                }
            });
        });
        // Extract and prepare updated student data
        const { first_name, last_name, address, course, guardain_name, emergency_contact_number, emergency_contact_name, date_of_enroll, email, contact_number, gender, date_of_birth, refered_by, school_name, } = req.body;
        const updatedData = {
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
            gender,
            date_of_birth,
            school_name,
            refered_by: refered_by || "",
            entry_by: userId, // Ensuring userId is included
        };
        // Handle image upload
        if (req.file) {
            const imagePath = req.file.path;
            const upload = yield (0, cloudinary_1.default)(imagePath);
            updatedData.image = upload === null || upload === void 0 ? void 0 : upload.secure_url; // Update image if a new one is uploaded
        }
        // Update student in the database using the ObjectId
        const updatedStudent = yield students_models_1.StudentSchema.findByIdAndUpdate(studentObjectId, updatedData, {
            new: true, // Return the updated document
        });
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        return res
            .status(200)
            .json({ message: "Student has been updated!", data: updatedStudent });
    }
    catch (error) {
        // Improved error handling
        console.error("Error updating student:", error);
        return next(error);
    }
});
exports.updateStudent = updateStudent;
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
            skip: skip,
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
        const studentWithPayment = yield payments_model_1.PaymentSchema.countDocuments({
            student: id,
        });
        if (studentWithPayment > 0) {
            res.status(400).json({
                error: "Cannot delete student because it payment data",
                studentsCount: studentWithPayment,
                message: "You must manage and resolve payment before deletion",
            });
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
        const studentData = (yield students_models_1.StudentSchema.findById(id, { __v: 0 })
            .populate([
            {
                path: "course",
                select: "course_name course_slug course_duration start_date ",
            },
            {
                path: "entry_by",
                select: "first_name last_name",
            },
        ])
            .lean());
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
// export const generateStudentData = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const { id } = req.params;
//   try {
//     // Fetch student data from database with proper typing
//     const studentData = (await StudentSchema.findById(id, {
//       __v: 0,
//     })
//       .populate([
//         {
//           path: "course",
//           select: "course_name course_slug course_duration start_date",
//         },
//         {
//           path: "entry_by",
//           select: "first_name last_name",
//         },
//       ])
//       .lean()) as unknown as StudentType;
//     if (!studentData) {
//       res.status(404).json({ message: "Student data not found!" });
//       return;
//     }
//     // Create a PDF document
//     const doc = new PDFDocument({
//       margin: 50,
//       size: "A4",
//     });
//     // Set response headers
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${studentData.first_name}_${studentData.last_name}.pdf`
//     );
//     // Pipe the PDF to the response
//     doc.pipe(res);
//     // Define colors and styles
//     const primaryColor = "#000000"; // Blue
//     const secondaryColor = "#ffffff"; // Light gray
//     const textColor = "#000000"; // Dark gray
//     // Add a header with title
//     doc.fontSize(20).fillColor(primaryColor).text("", { align: "center" });
//     doc.moveDown();
//     // Calculate positions
//     const pageWidth = doc.page.width - 100; // Account for margins
//     // Position for the image - ABOVE the card
//     const imageX = 50; // Position it to the right
//     const imageY = doc.y; // Current Y position after the title
//     // Add student image if available - BEFORE drawing the card
//     if (studentData.image && studentData.image.trim() !== "") {
//       try {
//         // Fetch the image from the URL
//         const imageResponse = await fetch(studentData.image);
//         if (imageResponse.ok) {
//           // Convert the image to a buffer
//           const imageBuffer = await imageResponse.buffer();
//           // Add the image with exact dimensions of 100x100px
//           doc.image(imageBuffer, imageX, imageY, {
//             width: 90,
//             height: 90,
//           });
//         } else {
//           throw new Error(
//             `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`
//           );
//         }
//       } catch (error) {
//         console.error("Error adding image to PDF:", error);
//         addImagePlaceholder(doc, imageX, imageY, primaryColor, textColor);
//       }
//     } else {
//       // No image URL available, add a placeholder
//       addImagePlaceholder(doc, imageX, imageY, primaryColor, textColor);
//     }
//     // Move down to create space between image and card
//     doc.moveDown(4); // Adjust this value as needed to create enough space
//     // Start the card after the image
//     const cardStartY = doc.y;
//     // Draw card background
//     doc
//       .roundedRect(50, cardStartY, pageWidth, 400, 10)
//       .fillAndStroke(secondaryColor, primaryColor);
//     // Student Information Section
//     doc
//       .fillColor(textColor)
//       .fontSize(16)
//       .text("Student Information", 70, cardStartY + 30);
//     doc.fontSize(12);
//     // Create two columns for student info
//     const col1X = 70;
//     const col2X = 300;
//     let rowY = cardStartY + 60;
//     // Column 1
//     doc.text("Name:", col1X, rowY);
//     doc.text(
//       `${studentData.first_name || ""} ${studentData.last_name || ""}`,
//       col1X + 50,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Email:", col1X, rowY);
//     doc.text(`${studentData.email || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Phone:", col1X, rowY);
//     doc.text(`${studentData.contact_number || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Gender:", col1X, rowY);
//     doc.text(`${studentData.gender || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Date of Birth:", col1X, rowY);
//     doc.text(`${studentData.date_of_birth}`, col1X + 80, rowY);
//     // Column 2
//     rowY = cardStartY + 60;
//     doc.text("Address:", col2X, rowY);
//     doc.text(`${studentData.address || "N/A"}`, col2X + 50, rowY, {
//       width: 150,
//     });
//     rowY += 40; // More space for address
//     doc.text("Guardian:", col2X, rowY);
//     doc.text(`${studentData.guardain_name || "N/A"}`, col2X + 60, rowY);
//     rowY += 20;
//     doc.text("E. C. Name:", col2X, rowY);
//     doc.text(
//       `${studentData.emergency_contact_name || "N/A"}`,
//       col2X + 70,
//       rowY
//     );
//     rowY += 20;
//     doc.text("E. C. Phone:", col2X, rowY);
//     doc.text(
//       `${studentData.emergency_contact_number || "N/A"}`,
//       col2X + 70,
//       rowY
//     );
//     // Course Information Section
//     rowY = cardStartY + 180;
//     doc
//       .fillColor(primaryColor)
//       .fontSize(16)
//       .text("Course Information", 70, rowY);
//     doc.fillColor(textColor).fontSize(12);
//     rowY += 30;
//     // Draw a line to separate sections
//     doc
//       .moveTo(70, rowY - 10)
//       .lineTo(pageWidth - 20, rowY - 10)
//       .stroke(primaryColor);
//     // Course details
//     doc.text("Course Name:", col1X, rowY);
//     doc.text(`${studentData.course?.course_name || "N/A"}`, col1X + 100, rowY);
//     rowY += 20;
//     doc.text("Duration:", col1X, rowY);
//     doc.text(
//       `${studentData.course?.course_duration || "N/A"}`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Start Date:", col1X, rowY);
//     doc.text(
//       `${
//         studentData.course?.start_date
//           ? new Date(studentData.course.start_date).toLocaleDateString()
//           : "N/A"
//       }`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Enrollment Date:", col1X, rowY);
//     doc.text(
//       `${
//         studentData.date_of_enroll
//           ? new Date(studentData.date_of_enroll).toLocaleDateString()
//           : "N/A"
//       }`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Refered By:", col1X, rowY);
//     doc.text(`${studentData?.refered_by || "N/A"}`, col1X + 100, rowY);
//     // Footer
//     const footerY = cardStartY + 350;
//     // Draw a line to separate footer
//     doc
//       .moveTo(70, footerY)
//       .lineTo(pageWidth - 20, footerY)
//       .stroke(primaryColor);
//     doc
//       .fontSize(10)
//       .text(
//         `Entry by: ${studentData.entry_by?.first_name || ""} ${
//           studentData.entry_by?.last_name || ""
//         }`,
//         70,
//         footerY + 15
//       );
//     doc.text(
//       `Generated on: ${new Date().toLocaleDateString()}`,
//       pageWidth - 150,
//       footerY + 15
//     );
//     // Add a QR code placeholder or reference number
//     doc.fontSize(8).text(`Reference ID: ${studentData._id}`, 70, footerY + 30);
//     // Finalize the PDF
//     doc.end();
//   } catch (error) {
//     console.error("Error in PDF generation:", error);
//     // Send error response
//     res.status(500).json({
//       error: "Failed to generate PDF",
//     });
//   }
// };
// // Helper function to add image placeholder
// function addImagePlaceholder(
//   doc: PDFKit.PDFDocument,
//   x: number,
//   y: number,
//   borderColor: string,
//   textColor: string
// ) {
//   doc.roundedRect(x, y, 100, 100, 5).fillAndStroke("#f5f5f5", borderColor);
//   doc
//     .fontSize(8)
//     .fillColor(textColor)
//     .text("No image available", x + 10, y + 40, {
//       width: 80,
//       align: "center",
//     });
// }
// export const generateStudentData = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   const { id } = req.params;
//   try {
//     // Fetch student data from database with proper typing
//     const studentData = (await StudentSchema.findById(id, {
//       __v: 0,
//     })
//       .populate([
//         {
//           path: "course",
//           select: "course_name course_slug course_duration start_date",
//         },
//         {
//           path: "entry_by",
//           select: "first_name last_name",
//         },
//       ])
//       .lean()) as unknown as StudentType;
//     if (!studentData) {
//       res.status(404).json({ message: "Student data not found!" });
//       return;
//     }
//     // Create a PDF document
//     const doc = new PDFDocument({
//       margin: 50,
//       size: "A4",
//     });
//     // Set response headers - make sure these are set correctly
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${studentData.first_name}_${studentData.last_name}.pdf"`
//     );
//     // Instead of collecting chunks and sending at the end, pipe directly to response
//     doc.pipe(res);
//     // Define colors and styles
//     const primaryColor = "#000000"; // Black
//     const secondaryColor = "#ffffff"; // White
//     const textColor = "#000000"; // Black
//     // Add a header with title
//     doc
//       .fontSize(20)
//       .fillColor(primaryColor)
//       .text("Student Information", { align: "center" });
//     doc.moveDown();
//     // Calculate positions
//     const pageWidth = doc.page.width - 100; // Account for margins
//     // Position for the image - ABOVE the card
//     const imageX = 50; // Position it to the right
//     const imageY = doc.y; // Current Y position after the title
//     // Add student image if available - BEFORE drawing the card
//     if (studentData.image && studentData.image.trim() !== "") {
//       try {
//         // Fetch the image from the URL
//         const imageResponse = await fetch(studentData.image);
//         if (imageResponse.ok) {
//           // Convert the image to a buffer
//           const imageBuffer = await imageResponse.arrayBuffer();
//           const buffer = Buffer.from(imageBuffer);
//           // Add the image with exact dimensions of 100x100px
//           doc.image(buffer, imageX, imageY, {
//             width: 90,
//             height: 90,
//           });
//         } else {
//           throw new Error(
//             `Failed to fetch image: ${imageResponse.status} ${imageResponse.statusText}`
//           );
//         }
//       } catch (error) {
//         console.error("Error adding image to PDF:", error);
//         addImagePlaceholder(doc, imageX, imageY, primaryColor, textColor);
//       }
//     } else {
//       // No image URL available, add a placeholder
//       addImagePlaceholder(doc, imageX, imageY, primaryColor, textColor);
//     }
//     // Move down to create space between image and card
//     doc.moveDown(4); // Adjust this value as needed to create enough space
//     // Start the card after the image
//     const cardStartY = doc.y;
//     // Draw card background
//     doc
//       .roundedRect(50, cardStartY, pageWidth, 400, 10)
//       .fillAndStroke(secondaryColor, primaryColor);
//     // Student Information Section
//     doc
//       .fillColor(textColor)
//       .fontSize(16)
//       .text("Student Information", 70, cardStartY + 30);
//     doc.fontSize(12);
//     // Create two columns for student info
//     const col1X = 70;
//     const col2X = 300;
//     let rowY = cardStartY + 60;
//     // Column 1
//     doc.text("Name:", col1X, rowY);
//     doc.text(
//       `${studentData.first_name || ""} ${studentData.last_name || ""}`,
//       col1X + 50,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Email:", col1X, rowY);
//     doc.text(`${studentData.email || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Phone:", col1X, rowY);
//     doc.text(`${studentData.contact_number || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Gender:", col1X, rowY);
//     doc.text(`${studentData.gender || "N/A"}`, col1X + 50, rowY);
//     rowY += 20;
//     doc.text("Date of Birth:", col1X, rowY);
//     doc.text(`${studentData.date_of_birth}`, col1X + 80, rowY);
//     // Column 2
//     rowY = cardStartY + 60;
//     doc.text("Address:", col2X, rowY);
//     doc.text(`${studentData.address || "N/A"}`, col2X + 50, rowY, {
//       width: 150,
//     });
//     rowY += 40; // More space for address
//     doc.text("Guardian:", col2X, rowY);
//     doc.text(`${studentData.guardain_name || "N/A"}`, col2X + 60, rowY);
//     rowY += 20;
//     doc.text("E. C. Name:", col2X, rowY);
//     doc.text(
//       `${studentData.emergency_contact_name || "N/A"}`,
//       col2X + 70,
//       rowY
//     );
//     rowY += 20;
//     doc.text("E. C. Phone:", col2X, rowY);
//     doc.text(
//       `${studentData.emergency_contact_number || "N/A"}`,
//       col2X + 70,
//       rowY
//     );
//     // Course Information Section
//     rowY = cardStartY + 180;
//     doc
//       .fillColor(primaryColor)
//       .fontSize(16)
//       .text("Course Information", 70, rowY);
//     doc.fillColor(textColor).fontSize(12);
//     rowY += 30;
//     // Draw a line to separate sections
//     doc
//       .moveTo(70, rowY - 10)
//       .lineTo(pageWidth - 20, rowY - 10)
//       .stroke(primaryColor);
//     // Course details
//     doc.text("Course Name:", col1X, rowY);
//     doc.text(`${studentData.course?.course_name || "N/A"}`, col1X + 100, rowY);
//     rowY += 20;
//     doc.text("Duration:", col1X, rowY);
//     doc.text(
//       `${studentData.course?.course_duration || "N/A"}`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Start Date:", col1X, rowY);
//     doc.text(
//       `${
//         studentData.course?.start_date
//           ? new Date(studentData.course.start_date).toLocaleDateString()
//           : "N/A"
//       }`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Enrollment Date:", col1X, rowY);
//     doc.text(
//       `${
//         studentData.date_of_enroll
//           ? new Date(studentData.date_of_enroll).toLocaleDateString()
//           : "N/A"
//       }`,
//       col1X + 100,
//       rowY
//     );
//     rowY += 20;
//     doc.text("Refered By:", col1X, rowY);
//     doc.text(`${studentData?.refered_by || "N/A"}`, col1X + 100, rowY);
//     // Footer
//     const footerY = cardStartY + 350;
//     // Draw a line to separate footer
//     doc
//       .moveTo(70, footerY)
//       .lineTo(pageWidth - 20, footerY)
//       .stroke(primaryColor);
//     doc
//       .fontSize(10)
//       .text(
//         `Entry by: ${studentData.entry_by?.first_name || ""} ${
//           studentData.entry_by?.last_name || ""
//         }`,
//         70,
//         footerY + 15
//       );
//     doc.text(
//       `Generated on: ${new Date().toLocaleDateString()}`,
//       pageWidth - 150,
//       footerY + 15
//     );
//     // Add a QR code placeholder or reference number
//     doc.fontSize(8).text(`Reference ID: ${studentData._id}`, 70, footerY + 30);
//     // Finalize the PDF
//     doc.end();
//   } catch (error) {
//     console.error("Error in PDF generation:", error);
//     // Send error response
//     res.status(500).json({
//       error: "Failed to generate PDF",
//       details: error instanceof Error ? error.message : String(error),
//     });
//   }
// };
// // Helper function to add image placeholder
// function addImagePlaceholder(
//   doc: PDFKit.PDFDocument,
//   x: number,
//   y: number,
//   borderColor: string,
//   textColor: string
// ) {
//   doc.roundedRect(x, y, 100, 100, 5).fillAndStroke("#f5f5f5", borderColor);
//   doc
//     .fontSize(8)
//     .fillColor(textColor)
//     .text("No image available", x + 10, y + 40, {
//       width: 80,
//       align: "center",
//     });
// }
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
