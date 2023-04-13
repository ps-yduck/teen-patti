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
  let cards: any = cardsDeck;
  let part: any = [];
  for (let i = 0; i < 9; i++) {
    let randomIndex: any = Math.floor(Math.random() * cards.length);
    part.push(cards[randomIndex]);
    cards.splice(randomIndex, 1);
  }

  return {
    part: part,
    remainingCards: cards,
  };
};
function removeCard(cardsDeck, card) {
  //console.log("removeCard", cardsDeck, card);
  for (let i = 0; i < cardsDeck.length; i++) {
    if (cardsDeck[i] === card) {
      cardsDeck.splice(i, 1);
      console.log("return", cardsDeck);
      return cardsDeck;
    }
  }
}
const createBiasedPartition = (cardsDeck) => {
  let cards: any = cardsDeck;
  console.log("err", cards);

  let biasedPart: any = ["7S", "2C", "7C", "AH", "8S", "8C", "KD", "1S", "1C"];
  for (let i = 0; i < 9; i++) {
    // remove bias cards from cardsDeck
    cards = removeCard(cards, biasedPart[i]);
  }
  console.log("biasedPart", biasedPart);
  console.log("remainingcards", cards);
  console.log("remainingcards length", cards.length);
  return {
    part: biasedPart,
    remainingCards: cards,
  };
};

const odds_for_player1 = false; // let it true to give best cards to player1 to check disable condition on winning game, by default false
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
const clientMap = new Map(); //all clients waiting and ingame , their id and socket id
let players = 0; // number of conn clients
let gameRoomPlayers = new Map(); // keeps unique consistent id and name, players in game
let gameRoom = "gameRoom"; // uset to create socket room

let gameOver = false;
let remainingCards = cardsDeck; // keeps updating as cards distr to each player
let cardsAllUsers = {}; //cards for all ids in game room and their name
// {id: {name: name, partition: {mycards: [], faceup: [], facedown: []} }

let clientsState: any; //initial state, pile , deck , turnm, msg
//has all ids data
//{id: {name: name, partition: {mycards: [], faceup: [], facedown: []} }, pile: [], deck: [], turn: 0, msg: "", gameOver: false}
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

  socket.on("clientId", (id) => {
    console.log("Received clientId:", id); // set a unique id (based user initial socket id which is stored in his session storage)
    clientMap.set(id, socket.id);
  });

  //console.log(clientMap);
  socket.on("clientName", (name, id) => {
    //this is not called on refresh at game page as it was called from home
    console.log("hgereeeee");
    players += 1;
    if (players <= 4) {
      if (players === 1 && odds_for_player1) {
        gameRoomPlayers.set(id, name); // add to gameroom map
        socket.join(gameRoom); // join room
        let cardPartition = createBiasedPartition(remainingCards);
        remainingCards = cardPartition.remainingCards;
        let partition = {
          mycards: cardPartition.part.slice(0, 3),
          faceup: cardPartition.part.slice(3, 6),
          facedown: cardPartition.part.slice(6, 9),
        };
        cardsAllUsers[id] = { name: name, partition: partition }; // create card partition for each id
      } else {
        gameRoomPlayers.set(id, name); // add to gameroom map
        socket.join(gameRoom); // join room
        let cardPartition = createPartition(remainingCards);
        remainingCards = cardPartition.remainingCards;
        let partition = {
          mycards: cardPartition.part.slice(0, 3),
          faceup: cardPartition.part.slice(3, 6),
          facedown: cardPartition.part.slice(6, 9),
        };
        cardsAllUsers[id] = { name: name, partition: partition }; // create card partition for each id
      }
    }
    if (players === 4) {
      io.to(gameRoom).emit("startGame", "start"); // send them to gamepage

      //all the state for all the clients
      clientsState = {
        clientCards: { ...cardsAllUsers },
        pile: [remainingCards[0]],
        deck: remainingCards.slice(1, remainingCards.length),
        turn: Array.from(gameRoomPlayers.keys())[turn],
        msg: ["Game Started"],
        gameOver: gameOver,
      };
    }
    if (players > 4) {
      io.to(socket.id).emit("startGame", "wait"); // send to atcapacity page
    }
  });
  socket.on("initGame", (id) => {
    //at gamepage user asks to initialize state
    //always call on refresh of gamepage , if some one reconnect add them to gameroom
    if (gameRoomPlayers.has(id)) {
      socket.join(gameRoom);
      console.log("refreshed from game page");
    }

    console.log("initGame", id);

    console.log("clientsState", clientsState);

    io.to(socket.id).emit("initState", clientsState);
  });

  socket.on("turnComplete", (data) => {
    //when client finish turn
    console.log("turnComplete", data);
    //game over condition
    if (
      data.partition.facedown.length === 0 &&
      data.partition.faceup.length === 0 &&
      data.partition.mycards.length === 0
    ) {
      console.log("game over");
      let winnermsg = `${clientsState.clientCards[data.id].name} won the game`;
      data = {
        winnermsg: clientsState.msg.concat(winnermsg),
      };
      io.to(gameRoom).emit("gameOver", data);
      gameOver = true;
      clientsState.gameOver = gameOver;

      //regular flow
    } else {
      turn = (turn + 1) % 4; //turn
      clientsState.turn = Array.from(gameRoomPlayers.keys())[turn]; // find id of next turn

      try {
        if (data.pile[data.pile.length - 1][0] === "1") {
          // burn on 10
          clientsState.pile = [];
        } else {
          clientsState.pile = data.pile; //pile
        }
      } catch (error) {
        // in facedown move we send empty pile so catch error
        clientsState.pile = data.pile;
      }

      clientsState.msg = clientsState.msg.concat(data.msg); //msg
      clientsState.msg = clientsState.msg.concat(
        `${clientsState.clientCards[clientsState.turn].name}'s turn is next`
      );
      clientsState.deck = data.deck;
      clientsState.clientCards[data.id].partition = data.partition; //update partition of client who took turn
      //console.log("new turn", clientsState.turn);
      console.log("new cleintsState", clientsState);
      if (
        (clientsState.clientCards[clientsState.turn].partition.mycards.length >
          0 &&
          hasAnyValidCard(
            clientsState.clientCards[clientsState.turn].partition.mycards,
            clientsState.pile
          )) ||
        (clientsState.clientCards[clientsState.turn].partition.mycards
          .length === 0 &&
          hasAnyValidCard(
            clientsState.clientCards[clientsState.turn].partition.faceup,
            clientsState.pile
          )) ||
        (clientsState.clientCards[clientsState.turn].partition.mycards
          .length === 0 &&
          clientsState.clientCards[clientsState.turn].partition.faceup
            .length === 0)
      ) {
        //check if next player has valid move, based on value card, myhand, faceup
        //in case only facedown left then all move from server side valid as player cant see cards
      } else {
        //skip turn
        clientsState.msg = clientsState.msg.concat(
          `Player ${
            clientsState.clientCards[clientsState.turn].name
          } has no valid card so his turn is skipped and he has to pick up the pile`
        );
        clientsState.clientCards[clientsState.turn].partition.mycards =
          clientsState.clientCards[clientsState.turn].partition.mycards.concat(
            clientsState.pile
          ); //not sure if concat work
        clientsState.pile = [];
        turn = (turn + 1) % 4;
        clientsState.turn = Array.from(gameRoomPlayers.keys())[turn];
      }
      //console.log("new turn sent", clientsState.msg);
      clientsState.gameOver = gameOver;
      io.to(gameRoom).emit("newTurn", clientsState);
    }
  });
});

///handle refreshon game page either with init or conncet message join them to game room
// here handle if turn need to be skipped due to invalid card in hand or hand card finished and invalid faceup card
// send updated state

// in client separate power and value validity, not use value fn in power as power card can be thrown over any card
