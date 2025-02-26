import mongoose from "mongoose";

const CourseSchemaModel = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
  },
  course_duration: {
    type: String,
    required: true,
  },
  start_date: {
    type: String,
  },
  course_slug: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

export const CourseSchema = mongoose.model("CourseSchema", CourseSchemaModel);
