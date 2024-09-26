const users = [];

exports.saveUser = (id, username, room) => {
  const user = { id, username, room };

  users.push(user);
  return user;
};

exports.getDisconnectUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id == id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

exports.getSameRoomUser = (room) => {
  return users.filter((user) => room == user.room);
};
