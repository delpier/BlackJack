//
// Blackjack
// by Ricardo Fonseca
//

// Card variables
let suits = ["Hearts", "Clubs", "Diamonds", "Spades"],
    values = ["Ace", "King", "Queen", "Jack",
        "Ten", "Nine", "Eight", "Seven", "Six",
        "Five", "Four", "Three", "Two"];

// DOM variables
let textArea = document.getElementById("text-area"),
    newGameButton = document.getElementById("new-game-button"),
    hitButton = document.getElementById("hit-button"),
    stayButton = document.getElementById("stay-button");

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

// Functions using SRP

function getNumericalValue(card) {
    if (card.value === "Ace") {
        return 1;
    } else if (card.value === "Two") {
        return 2;
    } else if (card.value === "Three") {
        return 3;
    } else if (card.value === "Four") {
        return 4;
    } else if (card.value === "Five") {
        return 5;
    } else if (card.value === "Six") {
        return 6;
    } else if (card.value === "Seven") {
        return 7;
    } else if (card.value === "Eight") {
        return 8;
    } else if (card.value === "Nine") {
        return 9;
    } else {
        return 10;
    }
}

function getScore(cardArray) {

    let score = 0;
    let hasAce = false;

    for (let i = 0; i < cardArray.length; i++) {
        let card = cardArray[i];
        score += getNumericalValue(card);

        if (card.value === "Ace") {
            hasAce = true;
        }
    }

    if (hasAce && score + 10 <= 21) {
        return score + 10;
    }
    return score;
}

function updateScores() {
    dealerScore = getScore(dealerCards);
    playerScore = getScore(playerCards);
}

function getNextCard(){
    return deck.shift();
}

function checkForEndOfGame() {

    updateScores();

    if (gameOver) {
        // let dealer take cards
        while (dealerScore <= playerScore
        && playerScore <= 21
        && dealerScore <= 21) {
            dealerCards.push(getNextCard());
            updateScores();
        }
    }

    if (playerScore > 21) {
        playerWon = false;
        gameOver = true;
    }
    else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
    }
    else if (gameOver) {
        playerWon = playerScore > dealerScore;
    }
}

function createDeck() {

    let deck = [];

    for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
            let card = {
                suit: suits[suitIdx],
                value: values[valueIdx]
            };
            deck.push(card);
        }
    }
    return deck;
}

function getCardString(card) {
    return card.value + " of " + card.suit;
}

function showStatus() {

    if (!gameStarted) {
        textArea.innerText = "Welcome to Blackjack!";
        return;
    }

    let dealerCardString = "";
    for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + "\n";
    }

    let playerCardString = "";
    for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + "\n";
    }

    updateScores();

    textArea.innerText =
        "Dealer has:\n" +
        dealerCardString +
        "(score: " + dealerScore + ")\n\n" +

        "Player has:\n" +
        playerCardString +
        "(score: " + playerScore + ")\n\n";

    if (gameOver) {
        if (playerWon) {
            textArea.innerText += "YOU WIN!";
        }
        else {
            textArea.innerText += "DEALER WINS!";
        }

        newGameButton.style.display = "inline";
        hitButton.style.display = "none";
        stayButton.style.display = "none";
    }
}

function shuffleDeck(deck) {

    for (let i = 0; i < deck.length; i++) {

        let swapIdx = Math.trunc(Math.random() * deck.length);
        let tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
    }

}

// Button visibility
hitButton.style.display = "none";
stayButton.style.display = "none";

// New Game Button Event
newGameButton.addEventListener("click", function () {

    gameStarted = true;
    gameOver = false;
    playerWon = false;

    deck = createDeck();
    shuffleDeck(deck);

    dealerCards = [getNextCard(), getNextCard()];
    playerCards = [getNextCard(), getNextCard()];

    newGameButton.style.display = "none";
    hitButton.style.display = "inline";
    stayButton.style.display = "inline";
    showStatus();

});

// Hit Button EventHandler
hitButton.addEventListener("click", function () {
    playerCards.push(getNextCard());
    checkForEndOfGame();
    showStatus();
});

// Stay Button EventHandler
stayButton.addEventListener("click", function () {
    gameOver = true;
    checkForEndOfGame();
    showStatus();
});

