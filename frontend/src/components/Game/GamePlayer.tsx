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
  let listItems: any = [];
  console.log("props.player: ", props.player);
  try {
    listItems = props.player.partition.faceup.map((card: any) => {
      const css = writecss(card);
      let suit = css[1];
      let rank = css[0];

      return (
        <li>
          <div className={`card rank-${css[0]} ${css[1]}`}>
            <span className="rank">{css[0]}</span>
            <span className="suit"> {getSuitSymbol(css[1])}</span>
          </div>
        </li>
      );
    });
  } catch (e) {
    console.log("gameplayer error: ", e);
  }

  return (
    <div className="game-players-container">
      <div className={`player-tag player-${props.id}`}>{props.player.name}</div>
      <ul className={`hand remove-margin player-${props.id}-cards`}>
        <li>
          <div className="card back">*</div>
        </li>
        {listItems[0] ? listItems[0] : <li></li>}
        <li>
          <div className="card back">*</div>
        </li>
        {listItems[1] ? listItems[1] : <li></li>}
        <li>
          <div className="card back">*</div>
        </li>
        {listItems[2] ? listItems[2] : <li></li>}
      </ul>
    </div>
  );
}
export default GamePlayer;
