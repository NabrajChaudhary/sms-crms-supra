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
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const constant_1 = require("../config/constant");
cloudinary_1.v2.config({
    cloud_name: constant_1.CLOUD_NAME,
    api_key: constant_1.CLOUDINARY_API_KEY,
    api_secret: constant_1.CLOUDINARY_API_SECRET_KEY,
});
/**
 * This is the configuration of filestorage which uses cloudinary
 * @param {*} filePath string of file path
 * @returns
 */
const urlUpload = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_1.v2.uploader.upload(filePath);
        return result;
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        else {
            console.log(String(error));
        }
    }
});
exports.default = urlUpload;
