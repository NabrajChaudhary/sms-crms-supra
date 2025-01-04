import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PORT } from "./config/constant";
import { dbConnection } from "./config/dbConnection";
import { authRoute } from "./routes/auth.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  next();
});

app.use("/api/auth/", authRoute);

dbConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
