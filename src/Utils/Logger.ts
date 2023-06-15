import { createLogger } from "winston";
import winston from "winston";

const Logger: winston.Logger = createLogger({
  transports: [
    new winston.transports.File({
      level: "info",
      filename: "./log/filelog-server.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "./log/filelog-error.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

export default Logger;
