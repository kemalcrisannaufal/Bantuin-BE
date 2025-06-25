import { IReqUser } from "../middleware/auth.middleware";
import { Response } from "express";
import response from "../utils/response";
import TransactionModel, {
  transactionDTO,
  TypeTransaction,
} from "../models/transaction.model";
import { FilterQuery, isValidObjectId } from "mongoose";

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
        .sort({ createdAt: -1 })
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
};

export default TransactionController;
