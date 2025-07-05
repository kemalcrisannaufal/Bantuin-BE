import mongoose, { ObjectId, Types } from "mongoose";
import * as Yup from "yup";
import { USER_MODEL_NAME } from "./user.model";

const Schema = mongoose.Schema;

export const TODO_STATUS = { PENDING: "pending", COMPLETED: "completed" };

export const todoDTO = Yup.object({
  title: Yup.string().required(),
  description: Yup.string(),
  dueDate: Yup.date().required(),
  status: Yup.string().oneOf(Object.values(TODO_STATUS)).nullable(),
  userId: Yup.string(),
});

export type TypeTodo = Yup.InferType<typeof todoDTO>;

export interface ITodo extends Omit<TypeTodo, "userId"> {
  userId: ObjectId;
}

const TodoSchema = new Schema<ITodo>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
    },
    dueDate: {
      type: Schema.Types.Date,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: Object.values(TODO_STATUS),
      default: TODO_STATUS.PENDING,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
  },
  { timestamps: true }
).index({ title: "text", description: "text" });

const TODO_MODEL_NAME = "Todo";
const TodoModel = mongoose.model(TODO_MODEL_NAME, TodoSchema);
export default TodoModel;
