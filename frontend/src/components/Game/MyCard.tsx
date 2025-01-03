import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { useNavigate } from "react-router-dom";
import {
  writecss,
  getSuitSymbol,
  moveValidInPower,
  moveValidInValue,
  removeCard,
} from "../../utils/util";
interface MyCardProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>; //this is the type for sockets
  player: any;
  pile: any;
  deck: any;
  turn: string;
  setPile: any;
  id: string;
  name: string;
  gameOver: boolean;
}

function MyCard(props: MyCardProps) {
  let faceUpList: any = [];
  let faceDownList: any = [];
  let myCardsList: any = [];
  let cardNotTwo = true; //force player to thrwo another card

  //console.log("props pile error: ", props.pile);
  //typeOfCard: faceUp, faceDown, myCards
  // handle mycard and faceup click
  const cardClickHandler = (card: any, cardsInPlay: any, typeOfCard: any) => {
    if (props.gameOver) {
      alert("Game Over cant play");
      return;
    }
    if (props.turn !== props.id) {
      alert("Not your turn");
      return;
    }
    if (
      typeOfCard === "faceUp" &&
      props.player.partition.mycards.length !== 0
    ) {
      alert("You have cards in hand to play");
      return;
    }
    let valid = false;
    cardNotTwo = true;

    //console.log("card clicked: ", card);
    if (
      card[0] === "2" ||
      card[0] === "7" ||
      card[0] === "8" ||
      card[0] === "1"
    ) {
      // console.log("power action card props.pile", card, props.pile);
      valid = moveValidInPower(cardsInPlay, props.pile, card);
      if (card[0] === "2" && valid) {
        alert("Throw another card");
        cardsInPlay = removeCard(cardsInPlay, card);
        // const css = writecss(card);
        // const rank = css[0];
        // const suit = css[1];
        // msg = msg + `${props.name} played ${rank} of ${suit} and `;
        // props.pile.push(card);
        props.setPile([...props.pile, card]);
        if (props.deck.length > 0) {
          props.player.partition.mycards.push(props.deck.pop());
        }

        cardNotTwo = false;
      }

      if (card[0] === "1" && valid) {
      }
    } else {
      //console.log("props.pile: ", props.pile);
      //non power card
      valid = moveValidInValue(props.pile, card);
    }
    if ((valid && cardNotTwo) || (props.pile.length === 0 && cardNotTwo)) {
      // pile.length cond added to continue throw any card on empty pile
      cardsInPlay = removeCard(cardsInPlay, card);
      props.pile.push(card);
      if (props.deck.length > 0) {
        props.player.partition.mycards.push(props.deck.pop());
      }

      // alert("Turn Complete");
      const css = writecss(card);
      const rank = css[0];
      const suit = css[1];

      let msg = `${
        props.name
      } played ${rank} of ${suit} and top card of pile was ${
        props.pile[props.pile.length - 2]
          ? props.pile[props.pile.length - 2][0]
          : "none"
      } of ${
        props.pile[props.pile.length - 2]
          ? props.pile[props.pile.length - 2][1]
          : "none"
      }`;

      props.socket.emit("turnComplete", {
        id: props.id,
        pile: props.pile,
        partition: props.player.partition,
        deck: props.deck,
        msg: msg,
      });
    } else {
      if (valid === false) {
        alert("Invalid Move");
      }
    }
  };

  const faceDownClickHandler = (card: any) => {
    let valid = false;
    if (props.gameOver) {
      alert("Game Over cant play");
      return;
    }
    if (props.turn !== props.id) {
      alert("Not your turn");
      return;
    }
    if (
      props.player.partition.mycards.length !== 0 ||
      props.player.partition.faceup.length !== 0
    ) {
      alert("You have cards in hand or in faceup, invalid move");
      return;
    }
    cardNotTwo = true;

    //console.log("card clicked: ", card);
    if (
      card[0] === "2" ||
      card[0] === "7" ||
      card[0] === "8" ||
      card[0] === "1"
    ) {
      //console.log("power action card props.pile", card, props.pile);
      valid = true;

      if (card[0] === "2" && valid) {
        alert("Throw another card");
        props.player.partition.facedown = removeCard(
          props.player.partition.facedown,
          card
        );
        // props.pile.push(card);
        const css = writecss(card);
        const rank = css[0];
        const suit = css[1];

        props.setPile([...props.pile, card]);
        if (props.deck.length > 0) {
          //console.log("this should never happen when facedown");
          props.player.partition.mycards.push(props.deck.pop());
        }

        cardNotTwo = false;
      }

      if (card[0] === "1" && valid) {
        //console.log("10 action", card);
      }
    } else {
      //console.log("props.pile: ", props.pile);
      valid = moveValidInValue(props.pile, card);
    }
    if ((valid && cardNotTwo) || (props.pile.length === 0 && cardNotTwo)) {
      // pile.length cond added to continue throw any card on empty pile
      props.player.partition.facedown = removeCard(
        props.player.partition.facedown,
        card
      );
      props.pile.push(card);
      if (props.deck.length > 0) {
        //console.log("this should never happen when facedown");
        props.player.partition.mycards.push(props.deck.pop());
      }

      // alert("Turn Complete");

      const css = writecss(card);
      const rank = css[0];
      const suit = css[1];

      let msg = `${
        props.name
      } played ${rank} of ${suit} and top card of pile was ${
        props.pile[props.pile.length - 2]
          ? props.pile[props.pile.length - 2][0]
          : "none"
      } of ${
        props.pile[props.pile.length - 2]
          ? props.pile[props.pile.length - 2][1]
          : "none"
      }`;

      props.socket.emit("turnComplete", {
        id: props.id,
        pile: props.pile,
        partition: props.player.partition,
        deck: props.deck,
        msg: msg,
      });
    } else {
      if (valid === false) {
        // false move then the face down card added to mycards and pile is given to player
        alert("Invalid Move, you are going to get the pile");
        props.player.partition.mycards = props.player.partition.mycards.concat(
          props.pile
        );
        props.player.partition.facedown = removeCard(
          props.player.partition.facedown,
          card
        );
        props.player.partition.mycards.push(card);
        props.socket.emit("turnComplete", {
          id: props.id,
          pile: [],
          partition: props.player.partition,
          deck: props.deck,
          msg: `${props.name} got the pile as his facedown card was invalid`,
        });
      }
    }
  };

  //html for mycards
  try {
    myCardsList = props.player.partition.mycards.map((card: any, key: any) => {
      const css = writecss(card);
      let suit = css[1];
      let rank = css[0];

      return (
        <li key={key}>
          <a
            className={`card rank-${css[0]} ${css[1]}`}
            onClick={() => {
              cardClickHandler(card, props.player.partition.mycards, "mycards");
            }}
          >
            <span className="rank">{css[0]}</span>
            <span className="suit"> {getSuitSymbol(css[1])}</span>
          </a>
        </li>
      );
    });
  } catch (e) {
    //console.log("gameplayer error: ", e);
  }

  //html for faceup
  try {
    faceUpList = props.player.partition.faceup.map((card: any, key: any) => {
      const css = writecss(card);
      let suit = css[1];
      let rank = css[0];

      return (
        <li>
          <a
            className={`card rank-${css[0]} ${css[1]}`}
            onClick={() => {
              cardClickHandler(card, props.player.partition.faceup, "faceUp");
            }}
          >
            <span className="rank">{css[0]}</span>
            <span className="suit"> {getSuitSymbol(css[1])}</span>
          </a>
        </li>
      );
    });
  } catch (e) {
    //console.log("gameplayer error: ", e);
  }

  //html for facedown
  try {
    faceDownList = props.player.partition.facedown.map(
      (card: any, key: any) => {
        return (
          <li>
            {/* <p>{card}</p> */}
            <a className="card back" onClick={() => faceDownClickHandler(card)}>
              <div className="card back">*</div>
            </a>
          </li>
        );
      }
    );
  } catch (e) {
    //console.log("gameplayer error: ", e);
  }

  return (
    <div className="right-side-container my-cards-container">
      <h1>My Cards</h1>
      <div className="my-cards-inner-container">
        <ul className="hand remove-margin">{myCardsList}</ul>
      </div>
      <div className="my-fixed-cards-container">
        <ul className="hand remove-margin">
          {faceDownList[0] ? faceDownList[0] : <li></li>}
          {faceUpList[0] ? faceUpList[0] : <li></li>}
          {faceDownList[1] ? faceDownList[1] : <li></li>}
          {faceUpList[1] ? faceUpList[1] : <li></li>}
          {faceDownList[2] ? faceDownList[2] : <li></li>}
          {faceUpList[2] ? faceUpList[2] : <li></li>}
        </ul>
      </div>
    </div>
  );
}

export default MyCard;

/// faceup cards click handler
// const faceUpClickHandler = async (card: any) => {
//   let valid = false;
//   if (props.gameOver) {
//     alert("Game Over cant play");
//     return;
//   }
//   if (props.turn !== props.id) {
//     alert("Not your turn");
//     return;
//   }
//   if (cardsInPlay.length !== 0) {
//     alert("You have cards in hand, invalid move");
//     return;
//   }
//   cardNotTwo = true;

//   console.log("card clicked: ", card);
//   if (
//     card[0] === "2" ||
//     card[0] === "7" ||
//     card[0] === "8" ||
//     card[0] === "1"
//   ) {
//     console.log("power action card props.pile", card, props.pile);
//     valid = moveValidInPower(props.player.partition.faceup, props.pile, card);
//     if (card[0] === "2" && valid) {
//       alert("Throw another card");
//       props.player.partition.faceup = removeCard(
//         props.player.partition.faceup,
//         card
//       );
//       // props.pile.push(card);

//       const css = writecss(card);
//       const rank = css[0];
//       const suit = css[1];
//       msg = msg + `${props.name} played ${rank} of ${suit} and `;
//       props.setPile([...props.pile, card]);
//       if (props.deck.length > 0) {
//         cardsInPlay.push(props.deck.pop());
//       } else {
//         console.log("deck empty"); // just to check when faceup cards then deck is empty
//       }

//       cardNotTwo = false;
//     }

//     if (card[0] === "1" && valid) {
//       console.log("10 action", card);
//       //props.setPile([]);
//       // add time delay
//       //console.log("wait");
//       //let wait = await new Promise((resolve) => setTimeout(resolve, 1000));
//       //console.log("wait done");
//     }
//   } else {
//     console.log("props.pile: ", props.pile);
//     valid = moveValidInValue(props.pile, card);
//   }
//   if ((valid && cardNotTwo) || (props.pile.length === 0 && cardNotTwo)) {
//     props.player.partition.faceup = removeCard(
//       props.player.partition.faceup,
//       card
//     );
//     props.pile.push(card);
//     if (props.deck.length > 0) {
//       console.log("this should never happen when faceup");
//       cardsInPlay.push(props.deck.pop());
//     }

//     // alert("Turn Complete");

//     const css = writecss(card);
//     const rank = css[0];
//     const suit = css[1];
//     msg =
//       msg +
//       `${props.name} played ${rank} of ${suit} and top card of pile was ${
//         props.pile[props.pile.length - 2]
//           ? props.pile[props.pile.length - 2][0]
//           : "none"
//       } of ${
//         props.pile[props.pile.length - 2]
//           ? props.pile[props.pile.length - 2][1]
//           : "none"
//       }`;

//     props.socket.emit("turnComplete", {
//       id: props.id,
//       pile: props.pile,
//       partition: props.player.partition,
//       deck: props.deck,
//       msg: msg,
//     });
//   } else {
//     if (valid === false) {
//       alert("Invalid Move");
//     }
//   }
// };
