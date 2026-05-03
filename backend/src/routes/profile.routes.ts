import { Router } from "express";
import { body } from "express-validator";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer: any = require("multer");
import { authMiddleware } from "../middleware/auth";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
} from "../controllers/profile.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", authMiddleware, getProfile);

router.put(
  "/",
  authMiddleware,
  [
    body("name").trim().notEmpty().withMessage("Nome é obrigatório"),
    body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
  ],
  updateProfile,
);

// Suporta dois formatos:
// 1. multipart/form-data (legacy) - com arquivo
// 2. application/json (novo para iOS) - com base64
router.post(
  "/photo",
  authMiddleware,
  upload.single("photo"),
  uploadProfilePhoto,
);

router.delete("/photo", authMiddleware, removeProfilePhoto);

export default router;
