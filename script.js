const guessInput = document.getElementById("guess");
const timeSelect = document.getElementById("timeSelect");
const checkButton = document.getElementById("checkButton");
const newGameButton = document.getElementById("newGame");

const message = document.getElementById("message");
const history = document.getElementById("history");

const attemptsElement = document.getElementById("attempts");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");

let secretCode = "";

let attempts = 8;
let time = 60;
let score = 0;
let level = 1;

let timerInterval;

let gameOver = false;


// ===============================
// CREAR CÓDIGO
// ===============================

function createSecretCode() {

    let numbers = [];

    while (numbers.length < 4) {

        const number = Math.floor(Math.random() * 10);

        if (!numbers.includes(number)) {
            numbers.push(number);
        }
    }

    return numbers.join("");
}


// ===============================
// INICIAR JUEGO
// ===============================

function startGame() {
secretCode = createSecretCode();

attempts = 8;

// Obtener el tiempo seleccionado
time = Number(timeSelect.value);
    gameOver = false;

    attemptsElement.textContent = attempts;
    timerElement.textContent = time;

    history.innerHTML = "";

    message.textContent =
        "🔎 El código secreto ha sido generado.";

    guessInput.value = "";

    guessInput.disabled = false;
    checkButton.disabled = false;

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        time--;

        timerElement.textContent = time;

        if (time <= 0) {
            loseGame("⏰ ¡Se acabó el tiempo!");
        }

    }, 1000);
}


// ===============================
// COMPROBAR CÓDIGO
// ===============================

function checkCode() {

    if (gameOver) {
        return;
    }

    const guess = guessInput.value.trim();

    // Validar longitud
    if (guess.length !== 4) {

        message.textContent =
            "⚠️ Debes introducir exactamente 4 números.";

        return;
    }

    // Validar números repetidos
    const uniqueNumbers = new Set(guess);

    if (uniqueNumbers.size !== 4) {

        message.textContent =
            "⚠️ Los números no pueden repetirse.";

        return;
    }

    let correctPosition = 0;
    let correctNumber = 0;

    // Revisar posiciones
    for (let i = 0; i < 4; i++) {

        if (guess[i] === secretCode[i]) {

            correctPosition++;

        } else if (secretCode.includes(guess[i])) {

            correctNumber++;
        }
    }

    attempts--;

    attemptsElement.textContent = attempts;

    addClue(
        guess,
        correctPosition,
        correctNumber
    );

    // GANÓ
    if (correctPosition === 4) {

        winGame();

        return;
    }

    // PERDIÓ
    if (attempts <= 0) {

        loseGame(
            `💀 Perdiste. El código era ${secretCode}`
        );

        return;
    }

    message.textContent =
        `🔐 ${correctPosition} correctos en posición y ${correctNumber} correctos pero mal ubicados.`;

    guessInput.value = "";

    guessInput.focus();
}


// ===============================
// AGREGAR PISTA
// ===============================

function addClue(
    guess,
    correctPosition,
    correctNumber
) {

    const clue = document.createElement("div");

    clue.className = "clue";

    clue.innerHTML = `
        <span class="clue-number">${guess}</span>

        <span>
            <span class="correct">
                🟢 ${correctPosition}
            </span>

            &nbsp;

            <span class="position">
                🟡 ${correctNumber}
            </span>
        </span>
    `;

    history.prepend(clue);
}


// ===============================
// GANAR
// ===============================

function winGame() {

    gameOver = true;

    clearInterval(timerInterval);

    // Más puntos si queda más tiempo
    const points = 100 + (attempts * 50) + (time * 5);

    score += points;

    scoreElement.textContent = score;

    message.textContent =
        `🏆 ¡CÓDIGO DESCIFRADO! +${points} puntos`;

    guessInput.disabled = true;
    checkButton.disabled = true;

    setTimeout(() => {

        level++;

        levelElement.textContent = level;

        message.textContent =
            "🔥 ¡Nivel completado! Pulsa NUEVA PARTIDA para continuar.";

    }, 1500);
}


// ===============================
// PERDER
// ===============================

function loseGame(text) {

    gameOver = true;

    clearInterval(timerInterval);

    message.textContent = text;

    guessInput.disabled = true;
    checkButton.disabled = true;
}


// ===============================
// EVENTOS
// ===============================

checkButton.addEventListener(
    "click",
    checkCode
);

newGameButton.addEventListener(
    "click",
    startGame
);

guessInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            checkCode();
        }

    }
);


// ===============================
// INICIAR
// ===============================

startGame();
