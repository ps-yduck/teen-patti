import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { writecss, getSuitSymbol } from "../../utils/util";

interface CenterTableProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  pile: any;
}

function CenterTable({ socket, pile }: CenterTableProps) {
  return (
    <div className="card-area">
      <ul className="hand remove-margin">
        {pile.map((card: any, key: any) => {
          // add new card at end of pile as styled that way
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
        })}
      </ul>
    </div>
  );
}

export default CenterTable;
