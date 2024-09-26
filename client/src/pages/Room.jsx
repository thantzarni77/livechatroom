import { useEffect, useRef, useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { FaUsers, FaUserAlt, FaArrowAltCircleDown } from "react-icons/fa";
import { BiSolidLogOut } from "react-icons/bi";
import { IoSend } from "react-icons/io5";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

const Room = ({ username, room, socket }) => {
  const navigate = useNavigate();

  const roomFLetter = room.charAt(0);
  const roomFLetterCap = roomFLetter.toUpperCase();
  const remainLetter = room.slice(1);
  const capWord = roomFLetterCap + remainLetter;

  const [roomUsers, setRoomUsers] = useState([]);
  const [receivedMessage, setReceiveMessage] = useState([]);
  const [message, setMessage] = useState("");

  const boxDivRef = useRef(null);

  const getOldMessage = async () => {
    const response = await fetch(`${import.meta.env.VITE_SERVER}/chat/${room}`);
    if (response.status === 403) {
      return navigate("/");
    }
    const data = await response.json();
    setReceiveMessage((prev) => [...prev, ...data]);
  };

  useEffect(() => {
    getOldMessage();
  }, []);

  useEffect(() => {
    //sent joined user's info to server
    socket.emit("joined_room", { username, room });

    //get message from server
    socket.on("message", (data) => {
      setReceiveMessage((prev) => [...prev, data]);
    });

    //get room users from server
    socket.on("room_users", (data) => {
      let prevRoomUsers = [...roomUsers];
      data.forEach((user) => {
        const index = prevRoomUsers.findIndex((prevUser) => {
          return prevUser.id == data.id;
        });

        if (index !== -1) {
          prevRoomUsers[index] = { ...prevRoomUsers[index], ...data };
        } else {
          prevRoomUsers.push(user);
        }

        setRoomUsers(prevRoomUsers);
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const leaveRoom = () => {
    navigate("/");
  };

  const sendMessage = () => {
    if (message.trim().length > 0) {
      socket.emit("message_send", message);
      setMessage("");
    }
  };

  useEffect(() => {
    if (boxDivRef.current) {
      boxDivRef.current.scrollTop = boxDivRef.current.scrollHeight;
    }
  }, [receivedMessage]);

  return (
    <div className="flex h-screen gap-3 p-2">
      <div className="flex w-1/3 flex-col items-center rounded-lg bg-blue-400/50 backdrop-blur-sm">
        <h1 className="my-4 text-2xl font-bold text-white">Room.io</h1>
        <div className="flex w-full items-center gap-5 rounded-bl-lg rounded-tl-lg border-b-2 border-l-2 border-t-2 border-blue-200/50 p-1 text-white">
          <IoMdChatbubbles className="text-[24px]" />
          <span className="text-[18px] font-semibold">{capWord}</span>
        </div>
        <div className="my-4 flex flex-col items-center">
          <h1 className="my-2 flex items-center gap-2 text-white">
            <FaUsers className="text-[25px]" />
            <span className="text-xl font-semibold">Users</span>
          </h1>
          {roomUsers.map((user, index) => {
            return (
              <p
                className="my-1 flex items-center gap-2 text-white"
                key={index}
              >
                <FaUserAlt />
                <span>
                  {user.username === username ? "you" : user.username}
                </span>
              </p>
            );
          })}
        </div>

        <button
          type="button"
          onClick={leaveRoom}
          className="absolute bottom-6 flex cursor-pointer items-center gap-2 text-white hover:text-gray-600"
        >
          <BiSolidLogOut className="text-[26px]" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
      <div className="relative w-full rounded-lg bg-blue-400/50 backdrop-blur-sm">
        <div
          className="flex h-[35rem] flex-col overflow-y-auto p-2"
          ref={boxDivRef}
        >
          {receivedMessage.map((message, index) => {
            return (
              <div
                key={index}
                className={`m-2 flex w-3/4 flex-col rounded-br-3xl rounded-tl-3xl bg-sky-500/50 p-2 font-semibold text-white ${username == message.username ? "self-end bg-blue-800/30" : ""}`}
              >
                <p className="font-mono text-sm">{message.username}</p>
                <p className="text-lg">{message.message}</p>
                <p className="self-end text-sm">
                  {formatDistanceToNow(new Date(message.sent_at))}
                </p>
              </div>
            );
          })}
        </div>
        <div className="absolute bottom-2 flex w-full items-center justify-between gap-2 p-4">
          <input
            className="w-full border-b bg-blue-400/0 font-semibold text-white outline-none placeholder:text-white/80"
            type="text"
            placeholder="Enter Message..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button type="button" onClick={sendMessage}>
            <IoSend className="text-[26px] text-white duration-200 hover:-rotate-45 hover:text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Room;
