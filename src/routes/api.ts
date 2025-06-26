import express from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";

const router = express.Router();

router.post(
  "/auth/register",
  AuthController.register
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required:true,
      schema: { $ref: '#/components/schemas/RegisterRequest'}
    } 
  */
);
router.post(
  "/auth/login",
  AuthController.login
  /**
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required:true,
      schema: { $ref: '#/components/schemas/LoginRequest'}
    } 
  */
);
router.get(
  "/auth/me",
  authMiddleware,
  AuthController.me
  /**
    #swagger.tags = ['Auth']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.post(
  "/auth/change-password",
  authMiddleware,
  AuthController.changePassword
  /**
    #swagger.tags = ['Auth']
    #swagger.security=[{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/ChangePasswordRequest'}
    }
  */
);

router.post(
  "/transaction",
  authMiddleware,
  TransactionController.create
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/CreateTransactionRequest'}
    }
  */
);

router.get(
  "/transaction",
  authMiddleware,
  TransactionController.findAll
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);
router.get(
  "/transaction/:id",
  authMiddleware,
  TransactionController.findOne
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);
router.put(
  "/transaction/:id",
  authMiddleware,
  TransactionController.update
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/CreateTransactionRequest'}
    }
  */
);
router.delete(
  "/transaction/:id",
  authMiddleware,
  TransactionController.delete
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

export default router;
