import path from "node:path";
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { createServer as createViteServer } from "vite";
import isNumeric from "../src/lib/isNumeric";
import api from "./api";
import winston from "winston";
import expressWinston from "express-winston";

config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

const isPortNumeric = isNumeric(process.env.SERVER_PORT);
if (!isPortNumeric) {
  console.warn("env.SERVER_PORT is undefined, falling back to 3001");
}
const port = isPortNumeric ? process.env.SERVER_PORT : 3001;

async function createServer() {
  app.use("/v1", api);

  if (process.env.NODE_ENV === "production") {
    // SPA simple server side
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "dist", "index.html"))
    );
  } else {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`🚀 server started at http://localhost:${port}`);
  });
}

createServer();
