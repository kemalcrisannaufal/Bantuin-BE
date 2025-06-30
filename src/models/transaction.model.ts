import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";
import { USER_MODEL_NAME } from "./user.model";
import { EXPENSE_CATEGORY, INCOME_CATEGORY } from "../constants/list.constants";

const Schema = mongoose.Schema;

export const transactionDTO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string(),
  amount: Yup.number().required(),
  date: Yup.date().required(),
  type: Yup.string().required(),
  category: Yup.string()
    .required()
    .when("type", {
      is: "income",
      then: (schema) => schema.oneOf(Object.values(INCOME_CATEGORY)),
      otherwise: (schema) => schema.oneOf(Object.values(EXPENSE_CATEGORY)),
    }),
  userId: Yup.string(),
});

export type TypeTransaction = Yup.InferType<typeof transactionDTO>;

export interface ITransaction extends Omit<TypeTransaction, "userId"> {
  userId: ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
    },
    amount: {
      type: Schema.Types.Number,
      required: true,
    },
    date: {
      type: Schema.Types.Date,
      required: true,
      index: true,
    },
    category: {
      type: Schema.Types.String,
      enum: [
        ...Object.values(INCOME_CATEGORY),
        ...Object.values(EXPENSE_CATEGORY),
      ],
      required: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
      enum: ["income", "expense"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
  },
  {
    timestamps: true,
  }
);

export const TRANSACTION_MODEL_NAME = "Transaction";
const TransactionModel = mongoose.model(
  TRANSACTION_MODEL_NAME,
  TransactionSchema
);

export default TransactionModel;
