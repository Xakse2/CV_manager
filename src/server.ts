import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import routerAttribute from "./routes/attribute.routes.js";
import routerVacancy from "./routes/vacancy.routes.js";
import routerAuth from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middleware/auth.middleware.js";
import routerUser from "./routes/user.routes.js";
import routerUserAttribute from "./routes/userAttribute.routes.js";
import routerProject from "./routes/project.routes.js";
import routerCv from "./routes/cv.router.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", routerAuth);
app.use("/api/attributes", authMiddleware, routerAttribute);
app.use("/api/vacancies", authMiddleware, routerVacancy);
app.use("/api/users", routerUser);
app.use("/api", authMiddleware, routerUserAttribute);
app.use("/api", authMiddleware, routerProject);
app.use("/api", authMiddleware, routerCv);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
