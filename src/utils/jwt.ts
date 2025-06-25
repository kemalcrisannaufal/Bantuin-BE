import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { Types } from "mongoose";
import { SECRET } from "./env";

export interface IUserToken
  extends Omit<
    IUser,
    "fullname" | "email" | "username" | "password" | "profilePicture"
  > {
  id?: Types.ObjectId;
}

const generateToken = (user: IUserToken) => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: "1h",
  });
  return token;
};
const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUser;
  return user;
};

export { generateToken, getUserData };
