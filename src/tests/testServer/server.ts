import express from "express";
import * as bodyParser from "body-parser";
import { apiKeyRoutes } from "./routes/apiKeys";
import {headersMiddleware} from "./middleware/middleware";
import {authRoutes} from "./routes/auth";

const server = express();

server.use(headersMiddleware);
server.use(bodyParser.json());
server.use("/api-keys", apiKeyRoutes);
server.use('/auth', authRoutes)

export default server;
