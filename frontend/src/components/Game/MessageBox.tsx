import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
interface MessageProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  //you can always add more functions/objects that you would like as props for this component
  msg: any;
}
function MessageBox({ socket, msg }: MessageProps) {
  console.log("msg", msg);
  return (
    <div className="right-side-container messages-container">
      <h1>Messages</h1>
      <div className="message-box">
        {msg.reverse().map((m: any) => {
          return <div className="message-content-container">{m}</div>;
        })}
      </div>
    </div>
  );
}

export default MessageBox;
