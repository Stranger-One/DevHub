import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-handler.js";
import userRouter from "./modules/users/user.routes.js";

const app: Express = express();


app.use(helmet());

app.use(
  cors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());


app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "devhub-api",
  });
});

app.use("/api/auth", userRouter);


app.use(errorHandler);

export default app;
