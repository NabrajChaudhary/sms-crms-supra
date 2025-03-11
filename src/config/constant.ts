import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

export const DB_URI = process.env.DB_URI;

export const SECRET_KEY = process.env.JWT_SECRET_KEY;

export const EMAIL = process.env.email;

export const PASSWORD = process.env.password;

export const CLOUD_NAME = process.env.cloud_name;

export const CLOUDINARY_API_SECRET_KEY = process.env.CLOUDINARY_API_SECRET_KEY;

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

export const REVALIDATION_HASH_KEY =
  process.env.REVALIDATION_HASH_KEY || "b1xlAOba36mH0EXOsss";

export const NEXT_JS_URL = process.env.NEXT_JS_URL || "http://localhost:3000";

// export const { PORT = 8000 } = process.env;
