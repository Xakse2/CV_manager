import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import attributeRoutes from "./routes/attribute.routes.js";

const mockAuth = (req: Request, res: Response, next: NextFunction) => {
  (req as any).user = {
    id: "mockID1",
    email: "123@123.com",
    firstName: "R",
    lastName: "RR",

    role: "RECRUITER",
  };
  next();
};

const app = express();

app.use(cors());
app.use(express.json());

app.use(mockAuth);

app.use("/api/attributes", attributeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
