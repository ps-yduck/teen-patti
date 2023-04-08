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
  console.log("connected");
  console.log(socket.id);
  // const id = useSelector((state:any) => state.clientId.value);
  // if(id === ""){
  //   dispatch
  // }
  if (sessionStorage.getItem("id") === null) {
    sessionStorage.setItem("id", socket.id);
  }
  socket.emit("clientId", sessionStorage.getItem("id"));
});
// socket.on("clientId", (data) => {
//   console.log(data);
//   //socket.emit("message", "Hello from client");
// });
// socket.on("cliendId", (data) => {
//   console.log(data);
//   socket.emi

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
