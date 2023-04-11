export function hasAnyValidCard(myCards: any, pile: any) {
  // add condition when myCards is empty for faceupcards
  for (let i = 0; i < myCards.length; i++) {
    if (
      moveValidInValue(pile, myCards[i]) ||
      myCards[i][0] === "8" ||
      myCards[i][0] === "7" ||
      myCards[i][0] === "2" ||
      myCards[i][0] === "1"
    ) {
      return true;
    }
  }
  return false;
}

export function moveValidInValue(pile: any, card: any) {
  if (pile === undefined || pile.length === 0) {
    return true;
  }
  const pileRank = pile[pile.length - 1][0];
  const cardRank = card[0];
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
    } else if (nextNonEightCard === "") {
      return true;
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
