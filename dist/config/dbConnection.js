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
const mongoose_1 = __importDefault(require("mongoose"));
const constant_1 = require("./constant");
const dbConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db_connection_uri = constant_1.DB_URI;
        if (!db_connection_uri) {
            console.error("MONGODB_URI environment variable is not defined");
            process.exit(1); // Exit with error
        }
        // Connect to MongoDB
        yield mongoose_1.default.connect(db_connection_uri);
        console.log("Connected to MongoDB successfully");
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit with error
    }
});
exports.default = dbConnection;
