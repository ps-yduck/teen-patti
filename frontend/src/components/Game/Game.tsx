import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MessageBox from "./MessageBox";
import MyCard from "./MyCard";
import CenterTable from "./CenterTable";
import GamePlayer from "./GamePlayer";

//create an interface for the props that you want to pass to this component
interface GamePageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
}

function GamePage({ socket }: GamePageProps) {
  const [pile, setPile] = useState([]);
  const [deck, setDeck] = useState([]);
  const [turn, setTurn] = useState("");
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [player3, setPlayer3] = useState({});
  const [playerMe, setPlayerMe] = useState({});
  const [msg, setMsg] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const id: any = sessionStorage.getItem("id");
  const state = useLocation();
  const name = state.state.name;

  useEffect(() => {
    console.log("init event sent", name);

    socket.emit("initGame", sessionStorage.getItem("id"));
    socket.on("initState", (data) => {
      setPile(data.pile);
      setDeck(data.deck);
      setTurn(data.turn);
      setMsg(data.msg);

      setPlayerMe(data.clientCards[id]);
      let playerid = 1;
      for (const [key, value] of Object.entries(data.clientCards)) {
        if (key !== id) {
          switch (playerid) {
            case 1:
              setPlayer1(value as any);
              playerid++;
              break;
            case 2:
              setPlayer2(value as any);
              playerid++;
              break;
            case 3:
              setPlayer3(value as any);
              playerid++;
              break;
          }
        }
      }
    });
    socket.on("newTurn", (data) => {
      console.log("new turn", data.pile);
      setTurn(data.turn);
      setDeck(data.deck);
      setPile(data.pile);
      setMsg(data.msg);
      setPlayerMe(data.clientCards[id]);
      let playerid = 1;
      for (const [key, value] of Object.entries(data.clientCards)) {
        if (key !== id) {
          switch (playerid) {
            case 1:
              setPlayer1(value as any);
              playerid++;
              break;
            case 2:
              setPlayer2(value as any);
              playerid++;
              break;
            case 3:
              setPlayer3(value as any);
              playerid++;
              break;
          }
        }
      }
    });
    socket.on("gameOver", (data) => {
      console.log("game over", data);
      setMsg(data.winnermsg);
      setGameOver(true);
    });
  }, []);
  console.log("rendered");

  return (
    <>
      <div className="main-container playingCards">
        <div className="game-container">
          <div className="heading-container">
            <h1>Teen Patti</h1>
          </div>
          <div className="game-table-container">
            <div className="game-table">
              <CenterTable socket={socket} pile={pile} />

              <GamePlayer id={"one"} socket={socket} player={player1} />

              <GamePlayer id={"two"} socket={socket} player={player2} />

              <GamePlayer id={"three"} socket={socket} player={player3} />

              <GamePlayer id={"four"} socket={socket} player={playerMe} />
            </div>
          </div>
        </div>
        <div className="messages-and-cards-container">
          <MessageBox socket={socket} msg={msg} />
          <MyCard
            socket={socket}
            player={playerMe}
            pile={pile}
            deck={deck}
            turn={turn}
            setPile={setPile}
            id={id}
            name={name}
            gameOver={gameOver}
          />
        </div>
      </div>
    </>
  );
}
export default GamePage;
