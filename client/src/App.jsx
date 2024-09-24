import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Room from "./pages/Room";
import { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [socket, setSocket] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Welcome
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
          setSocket={setSocket}
        />
      ),
    },
    {
      path: "chat",
      element: <Room room={room} username={username} socket={socket} />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
