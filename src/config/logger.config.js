import winston from "winston";
import { config } from "./env.config.js";
import "winston-daily-rotate-file";

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "blue",
    http: "cyan",
    debug: "white",
  },
};

winston.addColors(customLevels.colors);

const createLogger = (env) => {
  if (env === "production") {
    return winston.createLogger({
      levels: customLevels.levels,
      level: "info",
      transports: [
        new winston.transports.File({
          filename: "./logs/combined.log",
          level: "info",
          format: winston.format.json(),
        }),
        new winston.transports.File({
          filename: "./logs/error.log",
          level: "error",
          format: winston.format.json(),
        }),
      ],
    });
  }

  // Development logger
  return winston.createLogger({
    levels: customLevels.levels,
    level: "debug",
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple(),
        ),
      }),
    ],
  });
};

export const logger = createLogger(config.env);
