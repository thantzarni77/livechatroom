import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Room from "./pages/Room";
import { useState } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Welcome
          username={username}
          setUsername={setUsername}
          room={room}
          setRoom={setRoom}
        />
      ),
    },
    {
      path: "chat",
      element: <Room room={room} username={username} />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
