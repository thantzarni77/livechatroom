const Message = require("../models/Message");
const OPENED_ROOM = ["movies", "music", "sports", "politics"];

exports.getOldMessage = (req, res, next) => {
  const { room } = req.params;
  if (OPENED_ROOM.includes(room)) {
    Message.find({ room })
      .select("username message sent_at")
      .then((messages) => {
        res.status(200).json(messages);
      });
  } else {
    res.status(403).json("Room is not opened");
  }
};
