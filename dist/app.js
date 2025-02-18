"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = require("./config/constant");
const dbConnection_1 = require("./config/dbConnection");
const auth_routes_1 = require("./routes/auth.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    next();
});
app.use("/api/auth/", auth_routes_1.authRoute);
(0, dbConnection_1.dbConnection)();
app.listen(constant_1.PORT, () => console.log(`Server is running on port ${constant_1.PORT}`));
