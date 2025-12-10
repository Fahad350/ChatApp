import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
  },
});
server.listen(process.env.PORT, () => {
  console.log(`server running on PORT: ${process.env.PORT}`);
});
export default server;
