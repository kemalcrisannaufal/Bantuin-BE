import { IReqUser } from "../middleware/auth.middleware";
import { Response } from "express";
import response from "../utils/response";
import TodoModel, {
  ITodo,
  TODO_STATUS,
  todoDTO,
  TypeTodo,
} from "../models/todo.model";
import { FilterQuery, isValidObjectId, Types } from "mongoose";

const todoController = {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      await todoDTO.validate(req.body);

      const { title, description, dueDate } = req.body;

      const result = await TodoModel.create({
        title,
        description,
        dueDate,
        userId,
      });

      response.success(res, result, "Create todo success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const buildQuery = (filter: any, userId: string) => {
        const query: FilterQuery<TypeTodo> = { userId };

        query.userId = Types.ObjectId.createFromHexString(userId);

        if (filter.status) {
          query.status = filter.status;
        }

        if (filter.dueDate) {
          const startDate = new Date(filter.dueDate);
          startDate.setHours(0, 0, 0, 0);

          const endDate = new Date(filter.dueDate);
          endDate.setHours(23, 59, 59, 999);

          query.dueDate = {
            $gte: startDate,
            $lt: endDate,
          };
        }

        return query;
      };

      const { limit = 10, page = 1, status, dueDate } = req.query;

      const query = buildQuery({ status, dueDate }, `${userId}`);

      const result = await TodoModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .lean()
        .sort({ dueDate: -1 })
        .exec();

      const count = await TodoModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          current: +page,
          totalPage: Math.ceil(count / +limit),
          total: count,
        },
        "Success get all todo!"
      );
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Invalid id!");
      }

      const userId = req.user?.id;

      const result = await TodoModel.findOne({ _id: id, userId });

      if (!result) {
        return response.notFound(res);
      }

      response.success(res, result, "Success get One!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async update(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Invalid Id!");
      }

      await todoDTO.validate(req.body);

      const { title, description, dueDate } = req.body;

      const userId = req.user?.id;

      const result = await TodoModel.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        {
          title,
          description,
          dueDate,
        },
        {
          new: true,
        }
      );

      if (!result) {
        return response.notFound(res);
      }

      response.success(res, result, "Success update todo!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async remove(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Invalid Id!");
      }

      const userId = req.user?.id;

      const result = await TodoModel.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!result) {
        response.notFound(res);
      }

      response.success(res, result, "Success delete todo!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async markAsCompleted(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Invalid Id!");
      }

      const userId = req.user?.id;

      const todo = await TodoModel.findOne({
        _id: id,
        userId,
      });

      if (!todo) {
        return response.notFound(res);
      }

      if (todo?.status === "completed") {
        return response.error(res, "Todo as already completed!");
      }

      todo.status = TODO_STATUS.COMPLETED;
      todo.save();

      response.success(res, todo, "Success mark as completed todo!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async toDoToday(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);

      const result = await TodoModel.find({
        userId,
        dueDate: {
          $gte: startDate,
          $lte: endDate,
        },
      });

      response.success(res, result, "Success get today todo!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
};

export default todoController;
