import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PORT } from "./config/constant";
import { dbConnection } from "./config/dbConnection";
import { authRoute } from "./routes/auth.routes";
import { studentRoute } from "./routes/students.routes";
import { courseRoute } from "./routes/course.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());

app.use((req, res, next) => {
  next();
});

app.use("/api/auth/", authRoute);
app.use("/api/student", studentRoute);
app.use("/api/course", courseRoute);

dbConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
