var deck = [];

function createSuit (suit) {
  for (i = 2; i < 10; i++) {
    deck.push(i + "_of_" + suit);
  };
  deck.push("jack_of_" + suit);
  deck.push("queen_of_" + suit);
  deck.push("king_of_" + suit);
  deck.push("ace_of_" + suit);
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
};

function createDeck(numDeck) {
  for (j = 0; j < numDeck; j++) {
    createSuit("hearts");
    createSuit("diamonds");
    createSuit("clubs");
    createSuit("spades");
  };
  shuffle(deck);
};

var numDeck = 8;

function changeNumDeck(num){
  if (startPress === 0) {
    numDeck = num;
    createDeck(numDeck);
  };
}

var dealerCards = [];
var playerCards = [];
var playerScore = 0;
var dealerScore = 0;

var startPress = 0; //pressed if 1

function start() {
  if (startPress === 0) {
    if (deck.length < 53) {
      createDeck(numDeck);
    };
    playerCards.push(deck[0]);
    playerCards.push(deck[1]);
    dealerCards.push(deck[2]);
    dealerCards.push(deck[3]);
    deck = deck.slice(5, deck.length);
    updateCardVisual(0,2,playerCards, "p");
    updateCardVisual(1,2,dealerCards, "d");
    document.getElementById("d1").style.backgroundImage = "url(cards/blank.png)";
  }
  startPress = 1;
}

function updateCardVisual(cardStart, cardFin, userCards, pd) {
  for (i = cardStart; i < cardFin; i++) {
    var userUrl = "url(cards/" + userCards[i] + ".png)";
    var userId = pd + (i+1);
    document.getElementById(userId).style.backgroundImage = userUrl;
  }
}

var dealerCardsAce = 0;
var playerCardsAce = 0; //number of aces present

function checkAce() {
  playerCardsAce = 0;
  dealerCardsAce = 0;
  for (i = 0; i < playerCards.length; i++) {
    var inputArr = playerCards[i].split("_");
    if (inputArr[0] === "ace") {
      playerCardsAce++;
    };
  };
  for (i = 0; i < dealerCards.length; i++) {
    if (dealerCards[i].substring(0,3) === "ace") {
      dealerCardsAce++;
    };
  };
}

function countCards(userArray) {
  var total = 0;
  for (i = 0; i < userArray.length; i++) {
    var inputArray = userArray[i].split("_");
    if (inputArray[0] === "king" || inputArray[0] === "queen" || inputArray[0] === "jack") {
      total = Number(total) + 10;
    } else if (inputArray[0] === "ace") {
      total = Number(total) + 1;
    } else {
      total = Number(total) + Number(inputArray[0]);
    };
  };
  return total;
}

var playerBust = 0; //1 if bust
var playerFreeze = 0; //1 if end of go

function hit() {
  if (playerCards.length === 5) {
    playerFreeze = 1;
  };
  if (playerBust === 0 && playerFreeze === 0) {
    if (startPress === 1) {
      playerCards.push(deck[0]);
      deck = deck.slice(1, deck.length);
      updateCardVisual(playerCards.length - 1, playerCards.length, playerCards, "p");
    };
    if (countCards(playerCards) > 21) {
      document.getElementById('message').innerHTML = "You are bust"
      playerBust = 1;
      playerFreeze = 1;
    };
  };
};

function stand() {
  playerFreeze = 1;
  runDealer();
  checkAce();
}

var dealerFreeze = 0; //1 if end of dealer turn

function dealerHit() {
  dealerCards.push(deck[0]);
  deck = deck.slice(1, deck.length);
  updateCardVisual(dealerCards.length - 1, dealerCards.length, dealerCards, "d");
}

var dealerBlackjack = 0; //1 if dealer has ace and picture

function runDealer() {
  updateCardVisual(0, 1, dealerCards, "d");
  if (countCards(dealerCards) === 11 && dealerCardsAce !== 0) { //cover ace
    dealerFreeze = 1;
    dealerBlackjack = 1;
  };
  checkAce();
  if (countCards(dealerCards) < 17 && dealerFreeze === 0 && dealerCardsAce === 0) {
    dealerHit();
  };
  checkAce();
  if (countCards(dealerCards) < 17 && dealerFreeze === 0 && dealerCardsAce === 0) { ///no ace present
    dealerHit();
  };
  checkAce();
  if (countCards(dealerCards) < 17 && dealerFreeze === 0 && dealerCardsAce === 0) {
    dealerHit();
  };
  checkAce();
  if (dealerCardsAce !== 0 && (countCards(dealerCards) + 10) < 17 && dealerFreeze === 0) {
    dealerHit();
  };
  if (dealerCardsAce !== 0 && (countCards(dealerCards) + 10) < 17 && dealerFreeze === 0) {   //covers turn if ace present
    dealerHit();
  };
  if (dealerCardsAce !== 0 && (countCards(dealerCards) + 10) < 17 && dealerFreeze === 0) {
    dealerHit();
  };
  checkAce();
  score();
}

function score() {
  var playerRoundScore = countCards(playerCards);
  var dealerRoundScore = countCards(dealerCards);
  for (i = 0; i < playerCardsAce; i++) {
    if (playerRoundScore + 10 * (i + 1) < 22) {
      playerRoundScore = playerRoundScore + 10 * (i+1);
    }
  };
  for (i = 0; i < dealerCardsAce; i++) {
    if (dealerRoundScore + 10 * (i + 1) < 22) {
      dealerRoundScore = dealerRoundScore + 10 * (i+1);
    }
  };
  if (playerRoundScore > 21) {
    playerRoundScore = 0;
  };
  if (dealerRoundScore > 21) {
    dealerRoundScore = 0;
  };
  if (playerRoundScore === dealerRoundScore) {
    document.getElementById('message').innerHTML = "Draw";
  } else if (playerRoundScore > dealerRoundScore) {
    document.getElementById('message').innerHTML = "You Win";
    playerScore++;
  } else {
    document.getElementById('message').innerHTML = "Dealer Wins"
    dealerScore++;
  };
  document.getElementById('score').innerHTML = "Player " + playerScore + ", Dealer " + dealerScore;
}

function reset() {
  playerCards = [];
  dealerCards = [];
  startPress = 0;
  playerCardsAce = 0;
  dealerCardsAce = 0;
  playerBust = 0;
  playerFreeze = 0;
  dealerFreeze = 0;
  dealerBlackjack = 0;
  document.getElementById('message').innerHTML = "";
  document.getElementById("d1").style.backgroundImage = "none";
  document.getElementById("d2").style.backgroundImage = "none";
  document.getElementById("d3").style.backgroundImage = "none";
  document.getElementById("d4").style.backgroundImage = "none";
  document.getElementById("d5").style.backgroundImage = "none";
  document.getElementById("p1").style.backgroundImage = "none";
  document.getElementById("p2").style.backgroundImage = "none";
  document.getElementById("p3").style.backgroundImage = "none";
  document.getElementById("p4").style.backgroundImage = "none";
  document.getElementById("p5").style.backgroundImage = "none";
  start();
}
