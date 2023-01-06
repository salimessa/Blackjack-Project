
let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
let suits = ["C", "D", "H", "S"];

var deck = []; //array to hold deck
var deck;  //deck of cards

var dealerTotal = 0; //total for dealer
var yourTotal = 0; //total for player

var dealerAceCount = 0; //number of aces for dealer
var yourAceCount = 0; //number of aces for player

var hiddenCard; //hidden card for dealer
var canHit = true; //true if you can hit, false if you can't


//function to create deck
function createDeck() {
    //loop through suits and values to create deck
    for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + suits[i]);
        }
    }
}

//function to shuffle deck
function shuffleDeck() {
    //loop through deck and swap each card with a random card
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

//function to start game
function startGame() {
    hiddenCard = deck.pop();
    dealerTotal += getCardValue(hiddenCard);
    dealerAceCount += checkForAce(hiddenCard);
    //while dealer total is less than 17, keep drawing cards
    while (dealerTotal < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "cards/" + card + ".png";
        dealerTotal += getCardValue(card);
        dealerAceCount += checkForAce(card);
        document.getElementById("dealerCards").append(cardImg);
    }

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "cards/" + card + ".png";
        yourTotal += getCardValue(card);
        yourAceCount += checkForAce(card);
        document.getElementById("yourCards").append(cardImg);
    }

    document.getElementById("hitBtn").addEventListener("click", hit);
    document.getElementById("stayBtn").addEventListener("click", stay);

}

//function to hit
function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "cards/" + card + ".png";
    yourTotal += getCardValue(card);
    yourAceCount += checkForAce(card);
    document.getElementById("yourCards").append(cardImg);

    //check if you bust after hitting and disable hit button
    if (reduceAce(yourTotal, yourAceCount) > 21) {
        canHit = false;
    }

}

//function to stay
function stay() {
    dealerTotal = reduceAce(dealerTotal, dealerAceCount);
    yourTotal = reduceAce(yourTotal, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "cards/" + hiddenCard + ".png";

    let message = "";
    if (yourTotal > 21) {
        message = "Bust!";
        document.getElementById("results").style.color = "orange";
    }
    else if (dealerTotal > 21) {
        message = "You win!";
        document.getElementById("results").style.color = "green";
    }

    else if (yourTotal == dealerTotal) {
        message = "Push!";
        document.getElementById("results").style.color = "blue";
        canHit = true;

    }
    else if (yourTotal > dealerTotal) {
        message = "You Win!";
        //change color of text to green
        document.getElementById("results").style.color = "green";
    }
    else if (yourTotal < dealerTotal) {
        message = "You Lose!";
        document.getElementById("results").style.color = "red";
    }

    document.getElementById("dealerTot").innerText = dealerTotal;
    document.getElementById("yourTot").innerText = yourTotal;
    document.getElementById("results").innerText = message;
}

//function to get card value
function getCardValue(card) {
    //split card into value and suit
    let data = card.split("-");
    let value = data[0];

    //check if value is a number or a face card
    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

//function to check for ace
function checkForAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//function to reduce ace value
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

//function to bet money
function bet() {
    document.getElementById("betBtn").addEventListener("click", function () {
        let bet = document.getElementById("bet").value;
        document.getElementById("betText").innerHTML = "You Bet: $" + bet;
    });
}

//function to reset game
function reset() {
    document.getElementById("resetBtn").addEventListener("click", function () {
        //add refresh page function
        location.reload();

    });
}

//load functions
window.onload = function () {
    createDeck();
    shuffleDeck();
    startGame();
    bet();
    reset();
}