import express, { Express } from "express";
import cluster, { Worker } from "cluster";
import { cpus } from "os";
import dotenv from "dotenv";
import setTZ from "set-tz";
import Logger from "./Utils/Logger";
import InitExpress from "./Express";

setTZ("Asia/Katmandu");

const initializeServer = async (): Promise<void> => {
  try {
    dotenv.config();

    if (process.env.CLUSTER === "YES" && cluster.isPrimary) {
      const totalCpus: number = cpus().length;

      for (let i = 0; i < totalCpus; i++) {
        cluster.fork();
      }

      cluster.on("exit", (worker: Worker, code: number, signal: string) => {
        Logger.info(`Process ${worker.process.pid} died`);
        cluster.fork();
      });
    } else {
      const app: Express = express();
      InitExpress(app);
    }
  } catch (error) {
    Logger.error(error);
  }
};

initializeServer();
