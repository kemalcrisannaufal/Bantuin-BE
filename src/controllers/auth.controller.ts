import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as Yup from "yup";
import response from "../utils/response";
import UserModel from "../models/user.model";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middleware/auth.middleware";
import { isValidObjectId } from "mongoose";

type TRegister = {
  fullname: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const registerValidationSchema = Yup.object({
  fullname: Yup.string().required(),
  email: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref("password"), ""],
      "Confirmation password must match with password!"
    ),
});

type TLogin = {
  identifier: string;
  password: string;
};

const loginValidationSchema = Yup.object({
  identifier: Yup.string().required(),
  password: Yup.string().required(),
});

type TChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const changePasswordValidationSchema = Yup.object({
  currentPassword: Yup.string().required(),
  newPassword: Yup.string()
    .required()
    .min(8, "Password must be at least 8 characters"),
  confirmNewPassword: Yup.string()
    .required()
    .oneOf(
      [Yup.ref("newPassword"), ""],
      "Confirmation password must match with password!"
    ),
});

const AuthController = {
  async register(req: Request, res: Response) {
    try {
      await registerValidationSchema.validate(req.body);

      const { fullname, email, username, password, confirmPassword } =
        req.body as TRegister;

      if (password !== confirmPassword) {
        return response.error(
          res,
          "Confirmation password must match with password!"
        );
      }

      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return response.error(res, "Email already registered!");
      }

      const existingUsername = await UserModel.findOne({ username });
      if (existingUsername) {
        return response.error(res, "Username already taken!");
      }

      const result = await UserModel.create({
        fullname,
        email,
        username,
        password,
      });

      response.success(res, result, "Registration Success");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async login(req: Request, res: Response) {
    try {
      await loginValidationSchema.validate(req.body);

      const { identifier, password } = req.body as TLogin;

      const user = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
      });

      if (!user) {
        return response.notFound(res, "User not found!");
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return response.error(res, "Identifier or password is incorrect!");
      }

      const token = generateToken({
        id: user.id,
        role: user.role,
      });

      response.success(res, token, "Login success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async me(req: IReqUser, res: Response) {
    try {
      const id = req.user?.id;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not valid");
      }

      const user = await UserModel.findById(id);

      if (!user) {
        return response.notFound(res, "User not found!");
      }

      response.success(res, user, "Get me success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },

  async changePassword(req: IReqUser, res: Response) {
    try {
      await changePasswordValidationSchema.validate(req.body);

      const { currentPassword, newPassword, confirmNewPassword } =
        req.body as TChangePassword;

      if (newPassword !== confirmNewPassword) {
        return response.error(
          res,
          "Confirmation password must match with password!"
        );
      }

      const id = req.user?.id;

      if (!isValidObjectId(id)) {
        return response.notFound(res, "Id is not valid");
      }

      const user = await UserModel.findById(id);

      if (!user) {
        return response.notFound(res);
      }

      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordMatch) {
        return response.error(res, "Current password is incorrect!");
      }

      const result = await UserModel.findByIdAndUpdate(
        id,
        {
          password: await bcrypt.hash(newPassword, 10),
        },
        { new: true }
      );

      response.success(res, result, "Update password success!");
    } catch (error) {
      const err = error as Error;
      response.error(res, err.message);
    }
  },
};

export default AuthController;
