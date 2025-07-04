import express from "express";
import AuthController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";
import TransactionController from "../controllers/transaction.controller";
import noteController from "../controllers/note.controller";
import todoController from "../controllers/todo.controller";

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
  "/transactions",
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
  "/transactions",
  authMiddleware,
  TransactionController.findAll
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.get(
  "/transactions/totals",
  authMiddleware,
  TransactionController.total
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.get(
  "/transactions/summary/categories",
  authMiddleware,
  TransactionController.summaryByCategory
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.get(
  "/transactions/:id",
  authMiddleware,
  TransactionController.findOne
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

router.put(
  "/transactions/:id",
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
  "/transactions/:id",
  authMiddleware,
  TransactionController.delete
  /**
    #swagger.tags = ['Transaction']
    #swagger.security=[{ "bearerAuth": [] }]
  */
);

/** Note **/
router.post(
  "/notes",
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
  "/notes",
  authMiddleware,
  noteController.findAll
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.get(
  "/notes/:id",
  authMiddleware,
  noteController.findOne
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.put(
  "/notes/:id",
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
  "/notes/:id/pin-status",
  authMiddleware,
  noteController.switchPinStatus
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

router.delete(
  "/notes/:id",
  authMiddleware,
  noteController.delete
  /**
    #swagger.tags = ["Notes"]
    #swagger.security = [{ "bearerAuth" : [] }] 
  */
);

/** Todo **/
router.post(
  "/todos",
  authMiddleware,
  todoController.create
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/CreateTodoRequest'}
    }
  */
);

router.get(
  "/todos",
  authMiddleware,
  todoController.findAll
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
  */
);

router.get(
  "/todos/today",
  authMiddleware,
  todoController.toDoToday
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
  */
);

router.get(
  "/todos/:id",
  authMiddleware,
  todoController.findOne
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
  */
);

router.put(
  "/todos/:id",
  authMiddleware,
  todoController.update
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
    #swagger.requestBody = {
      required:true,
      schema: {$ref: '#/components/schemas/CreateTodoRequest'}
    }
  */
);

router.delete(
  "/todos/:id",
  authMiddleware,
  todoController.remove
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
  */
);

router.patch(
  "/todos/:id/status",
  authMiddleware,
  todoController.switchStatus
  /**
    #swagger.tags = ["Todo"]
    #swagger.security = [{ "bearerAuth": [] }] 
  */
);

export default router;
