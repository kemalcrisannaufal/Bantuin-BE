import express from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/me", authMiddleware, AuthController.me);
router.post(
  "/auth/change-password",
  authMiddleware,
  AuthController.changePassword
);

export default router;
