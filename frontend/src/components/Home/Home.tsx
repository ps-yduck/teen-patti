import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import "./Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//create an interface for the props that you want to pass to this component
interface HomePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function HomePage({ socket }: HomePageProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleClick = (socket: Socket) => {
    // console.log("Socket ID:", socket.id);
    // Do something with the socket object, such as emit an event
    socket.emit("clientName", name, sessionStorage.getItem("id"));
    setLoading(true);
    socket.on("startGame", (data) => {
      // waiting for reply from server to start game
      if (data === "start") {
        navigate("/game", { state: { name: name } });
      } else if (data === "wait") {
        navigate("/atCapacity");
      }
    });
  };

  return (
    <>
      <div className="sampleHomePage">
        <h1 className="sampleTitle">My Game</h1>
        {loading ? (
          <h1>Waiting for players to join...</h1>
        ) : (
          <div className="sampleMessage">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            ></input>
            <button onClick={() => handleClick(socket)}>
              Click me to send a name to server
            </button>
          </div>
        )}
      </div>
    </>
  );
}
export default HomePage;
