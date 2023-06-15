import { NextFunction, Request, Response } from "express";
import Logger from "./Logger";

const ErrorHandling = () => {
  return (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.errorLevel == "DB") {
      Logger.error(err.message);
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.status(400).send({ error: err.message ? err.message : err });
    }
  };
};
export default ErrorHandling;
