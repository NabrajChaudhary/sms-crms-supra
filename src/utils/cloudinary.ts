import { v2 as cloudinary } from "cloudinary";
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET_KEY,
} from "../config/constant";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET_KEY,
});

/**
 * This is the configuration of filestorage which uses cloudinary
 * @param {*} filePath string of file path
 * @returns
 */
const urlUpload = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log(String(error));
    }
  }
};

export default urlUpload;
