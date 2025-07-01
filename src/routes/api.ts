import express from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";
import noteController from "../controllers/note.controller";

const router = express.Router();

/** Auth **/
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

/** Transaction **/
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
  "/transaction/totals",
  authMiddleware,
  TransactionController.total
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.get(
  "/transaction/summary/categories",
  authMiddleware,
  TransactionController.summaryByCategory
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

/** Note **/
router.post(
  "/note",
  authMiddleware,
  noteController.create
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth": [] }] 
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/CreateNoteRequest'}
    }
  */
);

router.get(
  "/note",
  authMiddleware,
  noteController.findAll
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.get(
  "/note/:id",
  authMiddleware,
  noteController.findOne
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.put(
  "/note/:id",
  authMiddleware,
  noteController.update
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/UpdateNoteRequest'}
    }
  */
);

router.patch(
  "/note/:id/pin-status",
  authMiddleware,
  noteController.switchPinStatus
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.delete(
  "/note/:id",
  authMiddleware,
  noteController.delete
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

export default router;
