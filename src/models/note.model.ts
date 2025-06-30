import mongoose, { ObjectId } from "mongoose";
import * as Yup from "yup";
import { USER_MODEL_NAME } from "./user.model";

const Schema = mongoose.Schema;

export const noteDTO = Yup.object({
  title: Yup.string().required().max(100),
  content: Yup.string().required().max(5000),
  isPinned: Yup.boolean(),
  lastEdited: Yup.date(),
  userId: Yup.string(),
});

export type TypeNote = Yup.InferType<typeof noteDTO>;

export interface INote extends Omit<TypeNote, "userId"> {
  userId: ObjectId;
}

const NoteSchema = new Schema<TypeNote>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    content: {
      type: Schema.Types.String,
      required: true,
    },
    isPinned: {
      type: Schema.Types.Boolean,
      default: false,
    },
    lastEdited: {
      type: Schema.Types.Date,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER_MODEL_NAME,
    },
  },
  { timestamps: true }
).index({ title: "text", content: "text" });

NoteSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.lastEdited = new Date();
  }

  next();
});

export const NOTE_MODEL_NAME = "Note";
const NoteModel = mongoose.model(NOTE_MODEL_NAME, NoteSchema);
export default NoteModel;
