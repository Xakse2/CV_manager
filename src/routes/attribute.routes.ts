import { Router } from "express";
import {
  getAllAttributes,
  createAttribute,
  deleteAttribute,
} from "../controllers/attribute.controller.js";

const router: Router = Router();

router.get("/", getAllAttributes);
router.post("/", createAttribute);
router.delete("/:id", deleteAttribute);

export default router;
