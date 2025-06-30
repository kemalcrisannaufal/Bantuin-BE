import { Response } from "express";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import { IReqUser } from "../middleware/auth.middleware";
import response from "../utils/response";
import NoteModel, { noteDTO, TypeNote } from "../models/note.model";

const noteController = {
  async create(req: IReqUser, res: Response) {
    try {
      await noteDTO.validate(req.body);

      const userId = req.user?.id;

      const result = await NoteModel.create({
        ...req.body,
        userId,
      });

      response.success(res, result, "Create note success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async findAll(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const buildQuery = (filter: any, userId: string) => {
        let query: FilterQuery<TypeNote> = { userId };

        query.userId = Types.ObjectId.createFromHexString(userId);

        if (filter.search) {
          query.$text = { $search: filter.search };
        }

        return query;
      };

      const { search } = req.query;
      const query = buildQuery({ search }, `${userId}`);

      const result = await NoteModel.find(query);

      if (!result) {
        return response.notFound(res);
      }

      response.success(res, result, "Get notes success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async findOne(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not found!");
      }

      const result = await NoteModel.findOne({ _id: id, userId });

      if (!result) {
        response.notFound(res);
      }

      response.success(res, result, "Success get one transaction!");
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

      await noteDTO.validate(req.body);

      const userId = req.user?.id;

      const result = await NoteModel.findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        req.body,
        {
          new: true,
        }
      );

      response.success(res, result, "Update note success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async delete(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not found!");
      }

      const userId = req.user?.id;

      const result = await NoteModel.findOneAndDelete({
        _id: id,
        userId,
      });

      response.success(res, result, "Delete note success!")
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
};

export default noteController;
