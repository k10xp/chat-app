import express, { type Application } from "express";
import http from "http";
import { Server, Socket } from "socket.io";

const app: Application = express();
const server = http.createServer(app);

const io = new Server(server, {
  //TODO: enforce in production
  cors: { origin: "*" },
});

io.on("connection", (socket: Socket) => {
  console.log("a user connected:", socket.id);

  socket.on("message", (message: string) => {
    console.log("message from", socket.id, ":", message);

    //random nickname
    const shortId = socket.id.substring(0, 4);

    //everyone including sender
    io.emit("message", `${shortId} said ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

//health check
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
