const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");

const formatMessage = require("./utils/formatMSG");

const app = express();

app.use(cors);

const server = app.listen(4000, () => {
  console.log("Server is running at port 4000");
});

const io = socketIO(server, {
  cors: "*",
});

//Run when client-server connected
io.on("connection", (socket) => {
  console.log("client connected");
  const BOT = "ROOM MANAGER BOT";

  //send welcome message on first joining the room
  socket.emit("message", formatMessage(BOT, "Welcome to the room "));

  //send joined message to all users except newly connected user
  socket.broadcast.emit(
    "message",
    formatMessage(BOT, "User has joined the room")
  );

  //send leave message when a user leaved
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(BOT, "User has leaved the room"));
  });
});
