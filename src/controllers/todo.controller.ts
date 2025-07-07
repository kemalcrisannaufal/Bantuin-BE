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

        if (filter.search) {
          query.$text = { $search: filter.search };
        }

        if (filter.status) {
          query.status = filter.status;
        }

        if (filter.dueDate) {
          const startDate = new Date(filter.dueDate);

          const endDate = new Date(filter.dueDate);
          endDate.setHours(23, 59, 59, 999);

          query.dueDate = {
            $gte: startDate,
            $lt: endDate,
          };
        }

        if (filter.range) {
          const ranges = ["today", "tomorrow", "next7", "next30", "overdue"];
          let startDate;
          let endDate;

          const today = new Date();

          startDate = new Date();

          if (filter.upcoming === "true") {
            startDate.setHours(
              today.getHours(),
              today.getMinutes(),
              today.getSeconds()
            );
          } else {
            startDate.setHours(0, 0, 0, 0);
          }

          if (filter.range === "today") {
            endDate = new Date();
          }

          if (filter.range === "tomorrow") {
            endDate = new Date();
            endDate.setDate(today.getDate() + 1);
          }

          if (filter.range === "next7") {
            endDate = new Date();
            endDate.setDate(today.getDate() + 7);
          }

          if (filter.range === "next30") {
            endDate = new Date();
            endDate.setDate(today.getDate() + 30);
          }

          if (filter.range === "overdue") {
            endDate = today;
            endDate.setHours(
              today.getHours(),
              today.getMinutes(),
              today.getSeconds()
            );

            query.dueDate = {
              $lt: endDate,
            };
          }

          if (ranges.includes(filter.range) && filter.range !== "overdue") {
            endDate!.setHours(23, 59, 59, 999);

            query.dueDate = {
              $gte: startDate,
              $lt: endDate,
            };
          }
        }

        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        status,
        dueDate,
        range,
        upcoming = false,
        order = "asc",
      } = req.query;

      const query = buildQuery(
        { search, status, dueDate, range, upcoming },
        `${userId}`
      );

      const result = await TodoModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .lean()
        .sort({ dueDate: order === "asc" ? 1 : -1 })
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

  async switchStatus(req: IReqUser, res: Response) {
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

      todo.status =
        todo.status === TODO_STATUS.COMPLETED
          ? TODO_STATUS.PENDING
          : TODO_STATUS.COMPLETED;
      todo.save();

      response.success(
        res,
        todo,
        `Success switch todo status to ${todo.status}!`
      );
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
