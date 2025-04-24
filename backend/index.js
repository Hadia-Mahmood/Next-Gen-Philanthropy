import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import corsOptions from "./constants/corsOptions.js";
import { connectDataBase } from "./config/connectDB.js";

import configureCloudinary from "./config/cloudinaryConfig.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import beneficiaryRouter from "./routes/beneficiaryRoutes.js";
import organizationRouter from "./routes/organizationRoutes.js";
import uploadImageRouter from "./routes/imageRoutes.js";

import donorRouter from "./routes/donorRoutes.js";

const app = express();
dotenv.config();
app.use(cookieParser());

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors(corsOptions));

app.use("", userRouter);
app.use("/beneficiary", beneficiaryRouter);
app.use("/organization", organizationRouter);
app.use("/ipfs", uploadImageRouter); 
app.use("/donor", donorRouter);

connectDataBase();
configureCloudinary();

const server = app.listen(5000, () =>
  console.log(`Server started on port 5000`)
);





























