import { Router } from "express";
import {
  getAdminAnalytics,
  listAdminLearners,
  getLearnerDrilldown,
  listActivityLogs
} from "../controllers/admin.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

// Strict Server-Side RBAC Guard: All endpoints in /api/admin/* require ADMIN role
router.use(authenticate);
router.use(requireRole("ADMIN"));

router.get("/analytics", getAdminAnalytics);
router.get("/learners", listAdminLearners);
router.get("/learners/:id", getLearnerDrilldown);
router.get("/logs", listActivityLogs);

export default router;
