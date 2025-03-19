import { NextFunction, Request, Response } from "express";
import { StudentSchema } from "../models/students.models";
import { AuthRequest } from "../types/auth.types";
import upload from "../utils/upload";
import multer from "multer";
import urlUpload from "../utils/cloudinary";
import { revalidationTag } from "../utils/revalidate";
import { PaymentSchema } from "../models/payments.model";
import { Types } from "mongoose";

export const createStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.userId;

  try {
    upload.single("image")(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "File upload error" });
      } else if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      const {
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
        refered_by,
      } = req.body;

      const imagePath = req.file ? req.file.path : "";

      const upload = await urlUpload(imagePath);

      if (
        !first_name ||
        !last_name ||
        !email ||
        !course ||
        !guardain_name ||
        !date_of_enroll ||
        !contact_number ||
        !emergency_contact_name ||
        !emergency_contact_number ||
        !date_of_birth ||
        !gender
      ) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const student = await StudentSchema.findOne({
        email: req.body.email,
        contact_number: req.body.contact_number,
      });

      if (student) {
        res.status(400).json({ message: "This details are already in use!" });
        return;
      }

      await new StudentSchema({
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
        image: upload?.secure_url,
      }).save();

      await revalidationTag("student");
      res.status(201).json({ message: "Student has been added!" });
    });
  } catch (error) {
    next;
    res.status(500).json({ message: "Internal Error", error });
  }
};

export const updateStudent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const userId = req.userId;
  const { id } = req.params;

  try {
    // Check if the ID is valid
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    // Create a new ObjectId from the id string instead of reassigning
    const studentObjectId = new Types.ObjectId(id);

    // Wrap multer file upload in a Promise for handling file
    await new Promise<void>((resolve, reject) => {
      upload.single("image")(req, res, (err) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            reject(new Error(`File upload error: ${err.message}`));
          } else {
            reject(new Error(`Internal server error: ${err.message}`));
          }
        } else {
          resolve();
        }
      });
    });

    // Extract and prepare updated student data
    const {
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
      refered_by,
    } = req.body;

    const updatedData: any = {
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
      refered_by: refered_by || "",
      entry_by: userId, // Ensuring userId is included
    };

    // Handle image upload
    if (req.file) {
      const imagePath = req.file.path;
      const upload = await urlUpload(imagePath);
      updatedData.image = upload?.secure_url; // Update image if a new one is uploaded
    }

    // Update student in the database using the ObjectId
    const updatedStudent = await StudentSchema.findByIdAndUpdate(
      studentObjectId,
      updatedData,
      {
        new: true, // Return the updated document
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res
      .status(200)
      .json({ message: "Student has been updated!", data: updatedStudent });
  } catch (error) {
    // Improved error handling
    console.error("Error updating student:", error);
    return next(error);
  }
};

// export const updateStudent = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   const userId = req.userId;
//   const { id } = req.params;

//   // Log the ID to check its format
//   console.log("Received ID:", id);

//   try {
//     // Check if the ID is valid
//     if (!Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid student ID format" });
//     }

//     // Convert to ObjectId if valid
//     id = new Types.ObjectId(id);

//     // Wrap multer file upload in a Promise for handling file
//     await new Promise<void>((resolve, reject) => {
//       upload.single("image")(req, res, (err) => {
//         if (err) {
//           if (err instanceof multer.MulterError) {
//             reject(res.status(400).json({ message: "File upload error" }));
//           } else {
//             reject(res.status(500).json({ message: "Internal server error" }));
//           }
//         } else {
//           resolve();
//         }
//       });
//     });

//     // Extract and prepare updated student data
//     const {
//       first_name,
//       last_name,
//       address,
//       course,
//       guardain_name,
//       emergency_contact_number,
//       emergency_contact_name,
//       date_of_enroll,
//       email,
//       contact_number,
//       gender,
//       date_of_birth,
//       refered_by,
//     } = req.body;

//     const updatedData: any = {
//       first_name,
//       last_name,
//       address,
//       course,
//       guardain_name,
//       emergency_contact_number,
//       emergency_contact_name,
//       date_of_enroll,
//       email,
//       contact_number,
//       gender,
//       date_of_birth,
//       refered_by: refered_by || "",
//       entry_by: userId, // Ensuring userId is included
//     };

//     // Handle image upload
//     if (req.file) {
//       const imagePath = req.file.path;
//       const upload = await urlUpload(imagePath);
//       updatedData.image = upload?.secure_url; // Update image if a new one is uploaded
//     }

//     // Update student in the database
//     const updatedStudent = await StudentSchema.findByIdAndUpdate(
//       id,
//       updatedData,
//       {
//         new: true, // Return the updated document
//       }
//     );

//     if (!updatedStudent) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     return res
//       .status(200)
//       .json({ message: "Student has been updated!", data: updatedStudent });
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateStudent = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   const userId = req.userId;
//   const { id } = req.params;

//   const updatedStudentData = { ...req.body, entry_by: userId };
//   console.log("🚀 ~ updatedStudentData:", updatedStudentData);
//   try {
//     const updateStudent = await StudentSchema.findByIdAndUpdate(
//       id,
//       updatedStudentData,
//       { new: true }
//     );

//     if (!updateStudent) {
//       res.status(404).json({ error: "Student data not found" });
//     }
//     res.status(200).json({ message: "Student has been updated!" });
//   } catch (error) {
//     res.status(500).json({
//       error: "An error occurred while updating student data",
//     });
//   }
// };

export const getAllStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch total students count for pagination metadata
    const totalCount = await StudentSchema.countDocuments({
      isArchived: false,
    });

    const studentData = await StudentSchema.find({ isArchived: false })
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
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching student data",
    });
  }
};

interface StudentUpdateResult {
  success: boolean;
  message: string;
}

async function updateStudentArchiveStatus(
  id: string,
  shouldArchive: boolean
): Promise<StudentUpdateResult> {
  const student = await StudentSchema.findById(id);

  if (!student) {
    return { success: false, message: "Student data not found" };
  }

  if (student.isArchived === shouldArchive) {
    const status = shouldArchive ? "archived" : "active";
    return { success: false, message: `Student is already ${status}` };
  }

  student.isArchived = shouldArchive;
  await student.save();

  const action = shouldArchive ? "removed" : "restored";
  return { success: true, message: `Student has been ${action}!` };
}

export const removeStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateStudentArchiveStatus(id, true);

    if (!result.success) {
      res.status(400).json({ error: result.message });
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while removing student data",
    });
  }
};

export const restoreStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateStudentArchiveStatus(id, false);

    if (!result.success) {
      res.status(400).json({ error: result.message });
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while restoring student data",
    });
  }
};

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const student = await StudentSchema.findById(id);

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
    const studentWithPayment = await PaymentSchema.countDocuments({
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

    const deleteResult = await StudentSchema.deleteOne({ _id: id });

    if (deleteResult.deletedCount === 0) {
      res.status(500).json({ error: "Failed to delete student" });
      return;
    }

    res.status(200).json({ message: "Student has been permanently deleted" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while deleting student data",
    });
  }
};

export const getStudentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const studentData = await StudentSchema.findById(id, { __v: 0 }).populate([
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
  } catch (error) {
    res.status(500).json({
      error: "An error occured while fetching student data",
    });
  }
};

export const getArchivedStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch total students count for pagination metadata
    const totalCount = await StudentSchema.countDocuments({
      isArchived: true,
    });

    const studentData = await StudentSchema.find({ isArchived: true })
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
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching student data",
    });
  }
};
