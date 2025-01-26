import { Response } from "express";
export function sendResponse(
  res: Response,
  status: "success" | "error",
  message: string,
  data: any = null,
  errors: any[],
  statusCode: number = 200
) {
  res.status(statusCode).json({
    status,
    message,
    data,
    errors,
    timestamp: new Date().toISOString(),
  });
}
