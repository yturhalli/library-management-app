import { validationResult } from "express-validator";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { sendResponse } from "../helpers/Response/sendResponse";

export const validate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let responseErrors: string[] = []
    errors.array().forEach(err => responseErrors.push(err.msg))
    sendResponse(res, 'error', 'Request validation failed!', null, responseErrors, 400)
    return;
  }
  next();
};
