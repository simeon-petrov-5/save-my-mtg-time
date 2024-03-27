import { createPinoLogger } from "@bogeychan/elysia-logger";

const logging  = createPinoLogger({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export default logging;
