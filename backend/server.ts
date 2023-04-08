const { Socket } = require("socket.io");

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
import { hasAnyValidCard } from "./utils";

//////   utils  //////
const createPartition = (cardsDeck) => {
  //random partition of cards
  let cards = cardsDeck;
  let part = [];
  for (let i = 0; i < 9; i++) {
    let randomIndex = Math.floor(Math.random() * cards.length);
    part.push(cards[randomIndex]);
    cards.splice(randomIndex, 1);
  }

  return {
    part: part,
    remainingCards: cards,
  };
};

const clientMap = new Map();
let players = 0;
let gameRoomPlayers = new Map();
let gameRoom = "gameRoom";
const cardsDeck = [
  "2S",
  "3S",
  "4S",
  "5S",
  "6S",
  "7S",
  "8S",
  "9S",
  "1S",
  "JS",
  "QS",
  "KS",
  "AS",
  "2H",
  "3H",
  "4H",
  "5H",
  "6H",
  "7H",
  "8H",
  "9H",
  "1H",
  "JH",
  "QH",
  "KH",
  "AH",
  "2C",
  "3C",
  "4C",
  "5C",
  "6C",
  "7C",
  "8C",
  "9C",
  "1C",
  "JC",
  "QC",
  "KC",
  "AC",
  "2D",
  "3D",
  "4D",
  "5D",
  "6D",
  "7D",
  "8D",
  "9D",
  "1D", //10 dealt as 1 in frontend
  "JD",
  "QD",
  "KD",
  "AD",
];
let remainingCards = cardsDeck; // keeps updating as cards distr to each player
let initialState = {}; //cards for all ids in game room and their name
let clientsState: any; //initial state, pile , deck , turn
let turn = 0;

/////////////////
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

server.listen(3001, () => {
  console.log("SERVER IS LISTENING ON PORT 3001");
});
io.on("connection", (socket) => {
  console.log("user connected with a socket id", socket.id);
  //if id in gameroomplayer mean refresh from game page so add it back to room

  //add custom events here
  //give a unique id to the client
  //socket.to(socket.id).emit("clientId", socket.id);

  socket.on("clientId", (id) => {
    console.log("Received clientId:", id);
    clientMap.set(id, socket.id);
  });

  //console.log(clientMap);
  socket.on("clientName", (name, id) => {
    //this is not called on refresh at game page as it was called from home
    players += 1;
    if (players <= 4) {
      gameRoomPlayers.set(id, name);
      socket.join(gameRoom);
      let cardPartition = createPartition(remainingCards);
      remainingCards = cardPartition.remainingCards;
      let partition = {
        mycards: cardPartition.part.slice(0, 3),
        faceup: cardPartition.part.slice(3, 6),
        facedown: cardPartition.part.slice(6, 9),
      };
      initialState[id] = { name: name, partition: partition };
    }
    if (players === 4) {
      io.to(gameRoom).emit("startGame", "start");
      // console.log("initialState", initialState);
      console.log("gameRoomPlayers", gameRoomPlayers);
      console.log(Array.from(gameRoomPlayers.keys())[0]);
      clientsState = {
        clientCards: { ...initialState },
        pile: [remainingCards[0]],
        deck: remainingCards.slice(1, remainingCards.length),
        turn: Array.from(gameRoomPlayers.keys())[turn],
        msg: ["Game Started"],
      };
    }
    if (players > 4) {
      io.to(socket.id).emit("startGame", "wait");
      console.log("gameRoomPlayers", gameRoomPlayers);
      console.log("clientMap", clientMap);
    }
  });
  socket.on("initGame", (id) => {
    //always call on refresh of gamepage
    console.log("initGame", id);
    // let clientsState = {
    //   clientCards: { ...initialState },
    //   pile: [remainingCards[0]],
    //   deck: remainingCards.slice(1, remainingCards.length),
    // };
    console.log("clientsState", clientsState);
    io.to(socket.id).emit("initState", clientsState);
  });

  socket.on("turnComplete", (data) => {
    console.log("turnComplete", data);
    turn = (turn + 1) % 4;
    clientsState.turn = Array.from(gameRoomPlayers.keys())[turn];
    if (data.pile[data.pile.length - 1][0] === "1") {
      clientsState.pile = [];
    } else {
      clientsState.pile = data.pile;
    }

    //clientsState.pile = data.pile;
    clientsState.msg = clientsState.msg.concat(data.msg);
    clientsState.deck = data.deck;
    clientsState.clientCards[data.id].partition = data.partition;
    console.log("new turn", clientsState.turn);
    console.log("new cleintsState", clientsState);
    if (
      hasAnyValidCard(
        clientsState.clientCards[clientsState.turn].partition.mycards,
        clientsState.pile
      )
    ) {
      console.log("valid card in hand");
    } else {
      console.log("invalid card in hand");
      clientsState.msg = clientsState.msg.concat(
        `Player ${
          clientsState.clientCards[clientsState.turn].name
        } has no valid card in hand so his turn is skipped and he has to pick up the pile`
      );
      clientsState.clientCards[clientsState.turn].partition.mycards =
        clientsState.clientCards[clientsState.turn].partition.mycards.concat(
          clientsState.pile
        ); //not sure if concat work
      clientsState.pile = [];
      turn = (turn + 1) % 4;
      clientsState.turn = Array.from(gameRoomPlayers.keys())[turn];
    }
    console.log("new turn sent", clientsState.msg);
    io.to(gameRoom).emit("newTurn", clientsState);
  });
});

///handle refreshon game page either with init or conncet message join them to game room
// here handle if turn need to be skipped due to invalid card in hand or hand card finished and invalid faceup card
// send updated state

// in client separate power and value validity, not use value fn in power as power card can be thrown over any card
