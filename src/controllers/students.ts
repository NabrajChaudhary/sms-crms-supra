import { NextFunction, Request, Response } from "express";
import { StudentSchema } from "../models/students.models";
import { AuthRequest } from "../types/auth.types";
import upload from "../utils/upload";
import multer from "multer";
import urlUpload from "../utils/cloudinary";

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
        !gender ||
        !imagePath
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
        image: upload?.secure_url,
      }).save();
      res.status(201).json({ message: "Student has been added!" });
    });
  } catch (error) {
    next;
    res.status(500).json({ message: "Internal Error", error });
  }
};

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
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching student data",
    });
  }
};

export const updateStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updatedStudentData = req.body;
  try {
    const updateStudent = await StudentSchema.findByIdAndUpdate(
      id,
      updatedStudentData,
      { new: true }
    );

    if (!updateStudent) {
      res.status(404).json({ error: "Student data not found" });
    }
    res.status(200).json({ message: "Student has been updated!" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating student data",
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
