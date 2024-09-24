import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Welcome = ({ username, setUsername, room, setRoom, setSocket }) => {
  const navigate = useNavigate();

  // const dataEmptyAlert = () => {
  //   setWarning(true);
  //   const pDiv = document.querySelector(".parentDiv");
  //   const overlay = document.createElement("div");
  //   overlay.classList.add("overlay");
  //   pDiv.append(overlay);
  //   const alert = document.createElement("div");
  //   alert.classList.add("warning");
  //   alert.append("Please Fill all the values");
  //   pDiv.append(alert);
  // };

  const joinRoom = (e) => {
    e.preventDefault();
    if (
      username.trim().length > 0 &&
      room != "choose-room" &&
      room.trim().length > 0
    ) {
      const socket = io.connect("http://localhost:4000");
      setSocket(socket);
      navigate("/chat", { replace: true });
    } else {
      alert("Please fill all the values");
    }
  };
  return (
    <div className="parentDiv flex h-screen w-full items-center justify-center">
      <div className="flex w-[60%] flex-col items-center rounded-lg border-2 border-cyan-200/50 bg-blue-400/50 p-10 backdrop-blur-sm">
        <h1 className="mb-6 text-4xl font-extrabold text-white">ROOM.io</h1>
        <form onSubmit={joinRoom} className="w-full">
          <input
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="Enter Your Username..."
            className="inputCL mb-3 w-full rounded-lg p-2 indent-2 focus:outline-none focus:ring-gray-400"
          />
          <div className="mb-3 w-full">
            <select
              onChange={(e) => {
                setRoom(e.target.value);
              }}
              name="room"
              id="room"
              className="inputCL w-full rounded-lg p-2 text-center hover:cursor-pointer"
            >
              <option value="choose-room" disabled selected>
                -- Choose the Room --
              </option>
              <option value="movies">Movies</option>
              <option value="music">Music</option>
              <option value="sports">Sports</option>
              <option value="politics">Politics</option>
            </select>
          </div>
          <button className="inputCL w-full rounded-lg px-5 py-2 hover:bg-cyan-500/50">
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
