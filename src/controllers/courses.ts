import { NextFunction, Request, Response } from "express";
import { CourseSchema } from "../models/courses.model";

export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { course_name, start_date, course_duration, course_slug } = req.body;
  try {
    if (!course_name || !course_duration || !course_slug) {
      res.status(400).json({ message: "Missing required field!" });
      return;
    }

    const course = await CourseSchema.findOne({
      course_slug: req.body.course_slug,
    });

    if (course) {
      res.status(400).json({ message: "This course slug already exists" });
      return;
    }

    await new CourseSchema({
      course_name,
      course_slug,
      course_duration,
      start_date,
    }).save();
    res.status(201).json({ message: "Course has been added!" });
  } catch (error) {
    res.status(500).json({ message: "Internal Error", error });
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const course = await CourseSchema.findById(id);

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

    const deleteCourse = await CourseSchema.deleteOne({ _id: id });

    if (deleteCourse.deletedCount === 0) {
      res.status(500).json({ error: "Failed to delete Course" });
      return;
    }
    res.status(200).json({ message: "Course has been deleted" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while deleting student data",
    });
  }
};

export const getAllCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    // Fetch total students count for pagination metadata
    const totalCount = await CourseSchema.countDocuments({});

    const coursesData = await CourseSchema.find({}).select("-__v");
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
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching student data",
    });
  }
};

interface CourseUpdateResult {
  success: boolean;
  message: string;
}

async function updateCourseActiveStatus(
  id: string,
  shouldActive: boolean
): Promise<CourseUpdateResult> {
  const course = await CourseSchema.findById(id);

  if (!course) {
    return { success: false, message: "Course not found" };
  }

  if (course.isActive === shouldActive) {
    const status = shouldActive ? "activated" : "deactivated";
    return { success: true, message: `Course is already ${status}` };
  }

  course.isActive = shouldActive;
  await course.save();

  const action = shouldActive ? "activated" : "deactivated";
  return { success: true, message: `Course has been ${action}` };
}

export const deactiveCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateCourseActiveStatus(id, false);

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

export const activeCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await updateCourseActiveStatus(id, true);
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

export const allActiveCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    // Fetch total students count for pagination metadata
    const totalCount = await CourseSchema.countDocuments({ isActive: true });

    const courseData = await CourseSchema.find({ isActive: true })
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
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching Courses ",
    });
  }
};
