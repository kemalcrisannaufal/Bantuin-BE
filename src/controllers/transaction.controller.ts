import { IReqUser } from "../middleware/auth.middleware";
import { Response } from "express";
import response from "../utils/response";
import TransactionModel, {
  ITransaction,
  transactionDTO,
  TypeTransaction,
} from "../models/transaction.model";
import { FilterQuery, isValidObjectId, Types } from "mongoose";

const TransactionController = {
  async create(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      await transactionDTO.validate(req.body);

      const result = await TransactionModel.create({
        ...req.body,
        userId,
      });

      response.success(res, result, "Create transaction success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
  async findAll(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      const buildQuery = (filter: any, userId: string) => {
        let query: FilterQuery<TypeTransaction> = { userId };

        query.userId = Types.ObjectId.createFromHexString(userId);

        if (filter.type) {
          query.type = filter.type;
        }

        if (filter.category) {
          query.category = filter.category;
        }

        if (filter.month && filter.year) {
          const month = parseInt(filter.month);
          const year = parseInt(filter.year);

          const nextMonth = month === 12 ? 1 : month + 1;
          const nextYear = month === 12 ? year + 1 : year;

          query.date = {
            $gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            $lt: new Date(
              `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01`
            ),
          };
        }
        return query;
      };

      const { limit = 10, page = 1, type, category, month, year } = req.query;

      const query = buildQuery({ type, category, month, year }, `${userId}`);

      const result = await TransactionModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ date: -1 })
        .lean()
        .exec();

      const count = await TransactionModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          totalPage: Math.ceil(count / +limit),
          current: +page,
          total: count,
        },
        "Success get transaction!"
      );
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
  async findOne(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not found!");
      }

      const data = await TransactionModel.findById(id);
      if (!data) {
        return response.notFound(res);
      }

      response.success(res, data, "Succes get one transaction!");
      response.success;
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
  async update(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id not found");
      }

      await transactionDTO.validate(req.body);

      const result = await TransactionModel.findOneAndUpdate(
        { _id: id, userId },
        {
          ...req.body,
          userId,
        },
        { new: true }
      );

      if (!result) {
        response.notFound(res, "Transaction not found");
      }

      response.success(res, result, "Transaction update success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
  async delete(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id not found");
      }

      const result = await TransactionModel.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!result) {
        return response.notFound(res, "Transaction not found");
      }

      response.success(res, result, "Delete transaction success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async total(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid userId!");
      }

      const buildQuery = (filter: any, userId: string) => {
        let query: FilterQuery<ITransaction> = { userId };

        query.userId = Types.ObjectId.createFromHexString(userId);

        if (filter.month && filter.year) {
          const month = parseInt(filter.month);
          const year = parseInt(filter.year);

          const nextMonth = month === 12 ? 1 : month + 1;
          const nextYear = month === 12 ? year + 1 : year;

          query.date = {
            $gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            $lt: new Date(
              `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01`
            ),
          };
        }
        return query;
      };

      const { month, year } = req.query;
      const query = buildQuery({ month, year }, `${userId}`);

      const result = await TransactionModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalIncome: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      { $toLower: { $trim: { input: "$type" } } },
                      "income",
                    ],
                  },
                  "$amount",
                  0,
                ],
              },
            },
            totalExpense: {
              $sum: {
                $cond: [
                  {
                    $eq: [
                      { $toLower: { $trim: { input: "$type" } } },
                      "expense",
                    ],
                  },
                  "$amount",
                  0,
                ],
              },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      const totals = result[0] || {
        totalIncome: 0,
        totalExpense: 0,
        count: 0,
      };

      response.success(res, totals, "Success get totals!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async summaryByCategory(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId || !isValidObjectId(userId)) {
        return response.notFound(res, "Invalid User Id!");
      }

      const buildQuery = (filter: any, userId: string) => {
        const query: FilterQuery<ITransaction> = { userId };

        query.userId = Types.ObjectId.createFromHexString(userId);

        if (filter.type) {
          query.type = filter.type;
        }

        if (filter.month && filter.year) {
          const month = parseInt(filter.month);
          const year = parseInt(filter.year);

          const nextMonth = month === 12 ? 1 : month + 1;
          const nextYear = month === 12 ? year + 1 : year;

          query.date = {
            $gte: new Date(`${year}-${month.toString().padStart(2, "0")}-01`),
            $lt: new Date(
              `${nextYear}-${nextMonth.toString().padStart(2, "0")}-01`
            ),
          };
        }

        return query;
      };

      const { month, year, type } = req.query;
      const query = buildQuery({ month, year, type }, `${userId}`);

      const result = await TransactionModel.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              type: "$type",
              category: "$category",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $group: {
            _id: "$_id.type",
            categories: {
              $push: {
                category: "$_id.category",
                total: "$total",
              },
            },
          },
        },
      ]);

      response.success(res, result, "Success get summary by categories");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
};

export default TransactionController;
