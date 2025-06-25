import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken } from "../utils/jwt";
import response from "../utils/response";

export interface IReqUser extends Request {
  user?: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return response.unauthorize(res);
    }

    const [prefix, token] = authorization.split(" ");

    if (!(prefix === "Bearer" && token)) {
      return response.unauthorize(res);
    }

    const user = getUserData(token);
    (req as IReqUser).user = user;
    next();
  } catch (error) {
    const err = error as Error;
    response.error(res, err.message);
  }
};
