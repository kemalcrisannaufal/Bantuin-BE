import { Response } from "express";

type Pagination = {
  totalPage: number;
  current: number;
  total: number;
};

export default {
  success(res: Response, data: any, message: string) {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
    });
  },

  error(res: Response, message: string) {
    res.status(400).json({
      meta: {
        status: 400,
        message,
      },
      data: null,
    });
  },

  notFound(res: Response, message: string = "Data not found!") {
    res.status(404).json({
      meta: {
        status: 404,
        message,
      },
      data: null,
    });
  },

  unauthorize(res: Response, message: string = "Unauthorize") {
    res.status(403).json({
      meta: {
        status: 403,
        message,
      },
      data: null,
    });
  },

  pagination(
    res: Response,
    data: any[],
    pagination: Pagination,
    message: string
  ) {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
      pagination,
    });
  },
};
