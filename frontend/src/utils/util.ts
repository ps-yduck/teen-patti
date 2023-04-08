export function writecss(str: string) {
  const rank = str[0];
  const suit = str[1];
  const suitMap: any = {
    S: "spades",
    H: "hearts",
    C: "clubs",
    D: "diams",
  };
  const rankMap: any = {
    A: "a",
    J: "j",
    Q: "q",
    K: "k",
    "2": "2",
    "3": "3",
    "4": "4",
    "5": "5",
    "6": "6",
    "7": "7",
    "8": "8",
    "9": "9",
    "1": "10",
  };

  return [rankMap[rank], suitMap[suit]];
}

export function getSuitSymbol(suit: any) {
  switch (suit) {
    case "hearts":
      return "\u2665"; // heart suit symbol
    case "diams":
      return "\u2666"; // diamond suit symbol
    case "clubs":
      return "\u2663"; // club suit symbol
    case "spades":
      return "\u2660"; // spade suit symbol
    default:
      return "";
  }
}

export function moveValidInValue(pile: any, card: any) {
  // power card shouldnt enter here it should go throu power fn route
  if (pile === undefined || pile.length === 0) {
    return true;
  }
  const pileRank = pile[pile.length - 1][0];
  const cardRank = card[0];
  console.log("moveValidInValue pilerank cardrank", pileRank, cardRank);
  const rankMap: any = {
    "": 0,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "1": 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  if (pileRank === "7" && rankMap[cardRank] <= rankMap[pileRank]) {
    return true;
  } else if (pileRank === "7" && rankMap[cardRank] > rankMap[pileRank]) {
    return false;
  }

  if (pile[pile.length - 1][0] === "8") {
    let nextNonEightCard = cardEightAtTop(pile);
    if (
      nextNonEightCard[0] === "7" &&
      rankMap[cardRank] > rankMap[nextNonEightCard[0]]
    ) {
      return false;
    } else if (rankMap[cardRank] >= rankMap[nextNonEightCard[0]]) {
      return true;
    } else {
      return false;
    }
  }

  if (rankMap[cardRank] >= rankMap[pileRank]) {
    return true;
  } else {
    return false;
  }
}

export function moveValidInPower(myCards: any, pile: any, card: any) {
  //before it check card is power card
  console.log("moveValidInPower", myCards, pile, card);
  for (let i = 0; i < myCards.length; i++) {
    if (
      myCards[i] !== card &&
      myCards[i][0] !== "8" &&
      myCards[i][0] !== "7" &&
      myCards[i][0] !== "2" &&
      myCards[i][0] !== "1"
    ) {
      console.log("moveValidInPowerhhh", myCards[i][0], card);
      if (moveValidInValue(pile, myCards[i])) {
        return false;
      }
    }
  }
  console.log("moveValidInPoweryyy true");
  return true;
}

export function removeCard(myCards: any, card: any) {
  let index = myCards.indexOf(card);
  if (index > -1) {
    myCards.splice(index, 1);
  }
  return myCards;
}

export function cardEightAtTop(pile: any) {
  let card = "";
  let i = pile.length - 1;
  while (i >= 0) {
    if (pile[i][0] !== "8") {
      card = pile[i];
      break;
    }
    i--;
  }
  return card;
}
