import "dotenv/config";
import path from "node:path";
import args from "args";
import express, { Request, Response } from "express";
import compression from "compression";
import bodyParser from "body-parser";
import expressWinston from "express-winston";
import api from "./api";
import winston from "winston";
export { PUTV1File } from "@api/errors-api";

args.option(
  "port",
  "The port on which the app will be running",
  undefined,
  (v) => (v !== undefined ? parseInt(v) : v)
);
const flags = args.parse(process.argv) as { port: number | undefined };

const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      // Add the message timestamp with the preferred format
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
      // Tell Winston that the logs must be colored
      winston.format.colorize({ all: true }),
      // Define the format of the message showing the timestamp, the level and the message
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
      )
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
  })
);

const port = flags.port || parseInt(process.env.SERVER_PORT || "-") || 5000;
const clientPath = path.resolve(__dirname, "../..", "client");

async function createServer() {
  app.use("/v1", api);

  if (process.env.NODE_ENV === "production") {
    // SPA simple server side
    app.use(express.static(path.resolve(clientPath, "dist")));
    app.get("*", (req, res) =>
      res.sendFile(path.resolve(clientPath, "dist", "index.html"))
    );
  } else {
    const { createServer } = await import("vite");
    // Create Vite server in middleware mode
    const vite = await createServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`🚀 server started at http://localhost:${port}`);
  });
}

createServer();
