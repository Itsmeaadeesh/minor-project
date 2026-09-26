import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  generateQuizFromUpload,
  listQuizzes,
  getQuizById,
  submitQuizAttempt,
  getMyAttempts,
  deleteQuiz
} from "../controllers/quiz.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Ensure local uploads directory exists for buffering / local storage fallback
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (_req, file, cb) => {
    const allowedExts = [".pdf", ".docx", ".doc", ".pptx", ".txt", ".md"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type '${ext}'. Please upload PDF, PPTX, DOCX, or TXT.`));
    }
  }
});

router.post("/generate-from-file", authenticate, upload.single("document"), generateQuizFromUpload);
router.get("/", listQuizzes);
router.get("/my-attempts", authenticate, getMyAttempts);
router.get("/:id", authenticate, getQuizById);
router.post("/:id/attempt", authenticate, submitQuizAttempt);
router.delete("/:id", authenticate, requireRole("ADMIN"), deleteQuiz);

export default router;
