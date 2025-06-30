import { Express } from "express";
import swaggerUI from "swagger-ui-express";
import swaggerOutput from "./swagger_output.json";
import fs from "fs";

export default function docs(app: Express) {
  // const css = fs.readFileSync(
  //   require.resolve("swagger-ui-dist/swagger-ui.css"),
  //   "utf-8"
  // );
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerOutput));
}
