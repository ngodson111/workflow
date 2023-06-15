import express, { Express, Request, Response } from "express";
import helmet, { xssFilter } from "helmet";
import path from "path";
import cors from "cors";
import compression from "compression";
// import API from "./Api/Index";
// import Auth from "./Api/Middlewares/Auth";
import { Server } from "http";
// import ClientAuth from "./Api/Middlewares/ClientAuth";
import ErrorHandling from "./Utils/ErrorHandling";
import Logger from "./Utils/Logger";
import getConnection from "./Database/Connection";
import productEvent from "./Event/Product";

const InitExpress = (app: Express): Server => {
  app.use(compression());
  app.use(xssFilter());
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "../public")));

  //API's
  app.get("/", async (req, res) => {
    let sum = 0;
    if (req.query.id)
      for (let o = 0; o < +req.query.id; o++) {
        sum++;
      }
    const product = await subscribeProductEvent({
      type: "GET",
      data: 1,
    });
    res.send({ product, sum });
  });

  //Handle Error
  app.use(ErrorHandling());

  const PORT: string | number = process.env.PORT || 4000;
  const server: Server = app.listen(PORT, () => {
    Logger.info(`Server Starting: ${PORT}`);
    console.log("Server Running");
  });
  return server;
};

export default InitExpress;

const d = ["GET", "DELETE"] as const;
type Types = (typeof d)[number];
function subscribeProductEvent(options: { type: Types; data: number }) {
  switch (options.type) {
    case "GET":
      return new Promise((resolve, reject) => {
        productEvent.emit("getProduct", resolve, reject, options.data);
      });

    default:
      break;
  }
}
