import express from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";

const router = express.Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/auth/me", authMiddleware, AuthController.me);
router.post(
  "/auth/change-password",
  authMiddleware,
  AuthController.changePassword
);

router.post("/transaction", authMiddleware, TransactionController.create);
router.get("/transaction", authMiddleware, TransactionController.findAll);
router.put("/transaction/:id", authMiddleware, TransactionController.update);
router.delete("/transaction/:id", authMiddleware, TransactionController.delete);

export default router;
