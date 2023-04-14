import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writecss, getSuitSymbol } from "../../utils/util";

interface GamePlayerProps {
  id: string; // id of component for styling
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  player: any;
}

function GamePlayer(props: GamePlayerProps) {
  let faceUpList: any = [];
  //console.log("props.player: ", props.player);
  try {
    faceUpList = props.player.partition.faceup.map((card: any, key: any) => {
      const css = writecss(card);
      let suit = css[1];
      let rank = css[0];

      return (
        <li key={key}>
          <div className={`card rank-${css[0]} ${css[1]}`}>
            <span className="rank">{css[0]}</span>
            <span className="suit"> {getSuitSymbol(css[1])}</span>
          </div>
        </li>
      );
    });
  } catch (e) {
    //console.log("gameplayer error: ", e);
  }

  return (
    <div className="game-players-container">
      <div className={`player-tag player-${props.id}`}>{props.player.name}</div>
      <ul className={`hand remove-margin player-${props.id}-cards`}>
        <li>
          <div className="card back">*</div>
        </li>
        {faceUpList[0] ? faceUpList[0] : <li></li>}
        <li>
          <div className="card back">*</div>
        </li>
        {faceUpList[1] ? faceUpList[1] : <li></li>}
        <li>
          <div className="card back">*</div>
        </li>
        {faceUpList[2] ? faceUpList[2] : <li></li>}
      </ul>
    </div>
  );
}
export default GamePlayer;
