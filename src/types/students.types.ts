import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export type CoursesType = {
  _id: mongoose.Types.ObjectId;
  course_name: string | null;
  course_duration: string | null;
  course_slug: string | null;
  start_date: string;
};

export type EntryByType = {
  _id: mongoose.Types.ObjectId;
  first_name: string | null;
  last_name: string | null;
};

export type StudentType = {
  _id: mongoose.Types.ObjectId;
  first_name: string;
  last_name: string;
  gender: "male" | "female" | "other";
  date_of_birth: string;
  address: string;
  course: CoursesType; // Adjust based on actual course structure
  entry_by: EntryByType; // Adjust based on actual user structure
  guardain_name: string;
  emergency_contact_number: string;
  emergency_contact_name: string;
  date_of_enroll: string;
  email: string;
  contact_number: string;
  image: string;
  isArchived: boolean;
  refered_by: string;
  createdAt: string;
  updatedAt: string;
};
