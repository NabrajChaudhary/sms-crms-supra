"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CourseSchemaModel = new mongoose_1.default.Schema({
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
exports.CourseSchema = mongoose_1.default.model("CourseSchema", CourseSchemaModel);
