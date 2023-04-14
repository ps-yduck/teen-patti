import React from "react";
import logo from "./logo.svg";
import HomePage from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setClientId } from "./store/clientIdSlice";
import GamePage from "./components/Game/Game";

const socket = io("http://localhost:3001", { transports: ["websocket"] });
socket.on("connect", () => {
  //console.log("connected");
  //console.log(socket.id);

  if (sessionStorage.getItem("id") === null) {
    //creating unique client id for client
    sessionStorage.setItem("id", socket.id);
  }
  socket.emit("clientId", sessionStorage.getItem("id"));
});

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} />} />
          <Route path="/game" element={<GamePage socket={socket} />} />
          <Route path="/atCapacity" element={<div>At Capacity</div>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
