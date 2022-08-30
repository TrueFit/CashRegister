import express, { Express } from "express";
import dotenv from "dotenv";
import { setupAPIController } from "./controller";

dotenv.config();

export const app: Express = express();
const port = process.env.PORT;

export const server = app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});

setupAPIController();
