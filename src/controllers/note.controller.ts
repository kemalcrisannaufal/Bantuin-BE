import { Response } from "express";
import { FilterQuery, isValidObjectId, Types } from "mongoose";
import { IReqUser } from "../middleware/auth.middleware";
import response from "../utils/response";
import NoteModel, {
  noteDTO,
  noteUpdateDTO,
  TypeNote,
} from "../models/note.model";

const noteController = {
  async create(req: IReqUser, res: Response) {
    try {
      await noteDTO.validate(req.body);

      const userId = req.user?.id;

      const { title, content, isPinned } = req.body;

      if (isPinned) {
        const countPinned = await NoteModel.countDocuments({
          isPinned: true,
          userId,
        });

        if (countPinned >= 3) {
          return response.error(res, "Maximum pinned notes reached! (Max: 3)");
        }
      }

      const result = await NoteModel.create({
        title,
        content,
        isPinned,
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

        if (filter.isPinned) {
          query.isPinned = filter.isPinned;
        }

        return query;
      };

      const { limit = 10, page = 1, search, isPinned } = req.query;
      const query = buildQuery({ limit, page, search, isPinned }, `${userId}`);

      const result = await NoteModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      if (!result) {
        return response.notFound(res);
      }

      const count = await NoteModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          totalPage: Math.ceil(count / +limit),
          current: +page,
          total: count,
        },
        "Get notes success!"
      );
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

      await noteUpdateDTO.validate(req.body);

      const userId = req.user?.id;

      const { content, title } = req.body;

      const result = await NoteModel.findOneAndUpdate(
        {
          _id: id,
          userId,
          lastEdited: new Date(),
        },
        { content, title },
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

      response.success(res, result, "Delete note success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async switchPinStatus(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;

      const { id } = req.params;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not valid!");
      }

      const note = await NoteModel.findOne({ _id: id, userId });

      if (!note) {
        return response.notFound(res, "Note not found!");
      }

      if (!note.isPinned) {
        const countPinned = await NoteModel.countDocuments({
          isPinned: true,
          userId,
        });

        if (countPinned >= 3) {
          return response.error(res, "Maximum pinned notes reached! (Max: 3)");
        }
      }

      note.isPinned = !note.isPinned;
      await note.save();

      response.success(
        res,
        {
          isPinned: note.isPinned,
          noteId: note._id,
        },
        note.isPinned ? "Note pinned success!" : "Note unpinned success!"
      );
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
};

export default noteController;
