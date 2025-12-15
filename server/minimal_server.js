//TODO: use express for more options
const http = require("http").createServer();

const io = require("socket.io")(http, {
  //TODO: enforce in production
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("message", (message) => {
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

http.listen(8080, () => console.log("listening on http://localhost:8080"));
