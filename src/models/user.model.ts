import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  fullname: string;
  email: string;
  username: string;
  password: string;
  profilePicture: string;
  role: string;
}

const Schema = mongoose.Schema;

const UserSchema = new Schema<IUser>(
  {
    fullname: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "profile-picture-default.jpg",
    },
    role: {
      type: Schema.Types.String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

export const USER_MODEL_NAME = "User";
const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema);
export default UserModel;
