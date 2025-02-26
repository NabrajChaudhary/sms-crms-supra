"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StudentSchemaModel = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    date_of_birth: {
        type: Date,
        required: true,
        // validate: {
        //   validator: function (value: Date) {
        //     return value <= new Date(); // Ensures the date is not in the future
        //   },
        //   message: "Date of birth cannot be in the future.",
        // },
    },
    address: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "CourseSchema",
        required: true,
    },
    entry_by: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "AuthSchema",
        required: true,
    },
    guardain_name: {
        type: String,
        required: true,
    },
    emergency_contact_number: {
        type: String,
        required: true,
    },
    emergency_contact_name: {
        type: String,
        required: true,
    },
    date_of_enroll: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    isArchived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // This adds createdAt and updatedAt fields
});
exports.StudentSchema = mongoose_1.default.model("StudentSchema", StudentSchemaModel);
