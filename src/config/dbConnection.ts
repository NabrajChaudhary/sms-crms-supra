import mongoose from "mongoose";
import { DB_URI } from "./constant";

const dbConnection = async (): Promise<void> => {
  try {
    const db_connection_uri = DB_URI as string;

    if (!db_connection_uri) {
      console.error("MONGODB_URI environment variable is not defined");
      process.exit(1); // Exit with error
    }

    // Connect to MongoDB
    await mongoose.connect(db_connection_uri);

    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit with error
  }
};

export default dbConnection;
