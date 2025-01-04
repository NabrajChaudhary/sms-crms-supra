import mongoose from "mongoose";
import { DB_URI } from "./constant";

const db_connection_uri = DB_URI as string;

export const dbConnection = async () => {
  await mongoose
    .connect(db_connection_uri, {})
    .then(() => console.log("Connected to database"))
    .catch((err) => console.log("Connection Error", err));
};
