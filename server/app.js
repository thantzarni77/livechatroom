const express = require("express");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/messageRoute");

const formatMessage = require("./utils/formatMSG");
const {
  saveUser,
  getDisconnectUser,
  getSameRoomUser,
} = require("./utils/user");

const Message = require("./models/Message");

const app = express();

app.use(cors());

app.use(router);

mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected to database");
});

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

  //fired when user joined the room
  socket.on("joined_room", ({ username, room }) => {
    const user = saveUser(socket.id, username, room);
    socket.join(user.room);

    //send welcome message on first joining the room
    socket.emit("message", formatMessage(BOT, "Welcome to the room "));

    //send joined message to all users except newly connected user
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(BOT, `${user.username} has joined the room`)
      );

    //listen message from client
    socket.on("message_send", (data) => {
      //send message back to client
      io.to(user.room).emit("message", formatMessage(user.username, data));
      //store message in database
      Message.create({
        username: user.username,
        message: data,
        room: user.room,
      });
    });

    //send room users on joined room
    io.to(user.room).emit("room_users", getSameRoomUser(user.room));
  });

  //send leave message when a user leaved
  socket.on("disconnect", () => {
    const user = getDisconnectUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(BOT, `${user.username} has left the room`)
      );

      //update   room users on leaving the room
      io.to(user.room).emit("room_users", getSameRoomUser(user.room));
    }
  });
});
