// ======================================
// ELEMENTOS HTML
// ======================================

const guessInput = document.getElementById("guess");

const checkButton = document.getElementById("checkButton");

const newGameButton = document.getElementById("newGame");

const message = document.getElementById("message");

const history = document.getElementById("history");

const attemptsElement =
    document.getElementById("attempts");

const timerElement =
    document.getElementById("timer");

const scoreElement =
    document.getElementById("score");

const levelElement =
    document.getElementById("level");

const timeSelect =
    document.getElementById("timeSelect");


// ======================================
// VARIABLES
// ======================================

let secretCode = "";

let attempts = 8;

let time = 60;

let score = 0;

let level = 1;

let timerInterval = null;

let gameOver = false;


// ======================================
// CREAR CODIGO SECRETO
// ======================================

function createSecretCode() {

    let numbers = [];

    while (numbers.length < 4) {

        const number =
            Math.floor(Math.random() * 10);

        if (!numbers.includes(number)) {

            numbers.push(number);
        }
    }

    return numbers.join("");
}


// ======================================
// OCULTAR CODIGO
// ======================================

function hideSecretCode() {

    const secret =
        document.getElementById("secret");

    secret.innerHTML = `
        <span>?</span>
        <span>?</span>
        <span>?</span>
        <span>?</span>
    `;
}


// ======================================
// MOSTRAR CODIGO
// ======================================

function revealSecretCode() {

    const secret =
        document.getElementById("secret");

    secret.innerHTML = "";

    for (const number of secretCode) {

        const span =
            document.createElement("span");

        span.textContent = number;

        secret.appendChild(span);
    }
}


// ======================================
// INICIAR PARTIDA
// ======================================

function startGame() {

    // Crear código nuevo
    secretCode =
        createSecretCode();

    // Reiniciar intentos
    attempts = 8;

    // IMPORTANTE:
    // Tomar el tiempo seleccionado
    time = parseInt(
        timeSelect.value,
        10
    );

    // Reiniciar estado
    gameOver = false;


    // ==================================
    // ACTUALIZAR PANTALLA
    // ==================================

    attemptsElement.textContent =
        attempts;

    timerElement.textContent =
        time;

    history.innerHTML = "";

    message.textContent =
        "🔎 Estoy pensando un código...";

    guessInput.value = "";

    guessInput.disabled = false;

    checkButton.disabled = false;

    hideSecretCode();


    // ==================================
    // DETENER CONTADOR ANTERIOR
    // ==================================

    clearInterval(timerInterval);


    // ==================================
    // INICIAR CONTADOR
    // ==================================

    timerInterval = setInterval(function () {

        if (gameOver) {

            clearInterval(timerInterval);

            return;
        }

        time--;

        timerElement.textContent =
            time;


        // ==================================
        // SE ACABÓ EL TIEMPO
        // ==================================

        if (time <= 0) {

            time = 0;

            timerElement.textContent = "0";

            loseGame(
                "⏰ ¡Se acabó el tiempo!"
            );
        }

    }, 1000);
}


// ======================================
// COMPROBAR CODIGO
// ======================================

function checkCode() {

    if (gameOver) {

        return;
    }


    const guess =
        guessInput.value.trim();


    // ==================================
    // VALIDAR 4 NUMEROS
    // ==================================

    if (!/^\d{4}$/.test(guess)) {

        message.textContent =
            "⚠️ Debes introducir exactamente 4 números.";

        return;
    }


    // ==================================
    // NUMEROS REPETIDOS
    // ==================================

    const uniqueNumbers =
        new Set(guess);

    if (uniqueNumbers.size !== 4) {

        message.textContent =
            "⚠️ Los 4 números deben ser diferentes.";

        return;
    }


    // ==================================
    // CALCULAR PISTAS
    // ==================================

    let correctPosition = 0;

    let correctNumber = 0;


    // ==================================
    // PRIMERA PASADA
    // POSICIONES CORRECTAS
    // ==================================

    for (let i = 0; i < 4; i++) {

        if (
            guess[i] ===
            secretCode[i]
        ) {

            correctPosition++;
        }
    }


    // ==================================
    // SEGUNDA PASADA
    // NUMERO CORRECTO
    // PERO POSICION INCORRECTA
    // ==================================

    for (let i = 0; i < 4; i++) {

        if (
            guess[i] !== secretCode[i] &&
            secretCode.includes(guess[i])
        ) {

            correctNumber++;
        }
    }


    // ==================================
    // RESTAR INTENTO
    // ==================================

    attempts--;

    attemptsElement.textContent =
        attempts;


    // ==================================
    // MOSTRAR PISTA
    // ==================================

    addClue(
        guess,
        correctPosition,
        correctNumber
    );


    // ==================================
    // GANÓ
    // ==================================

    if (correctPosition === 4) {

        winGame();

        return;
    }


    // ==================================
    // SE QUEDÓ SIN INTENTOS
    // ==================================

    if (attempts <= 0) {

        loseGame(
            "💀 ¡Te quedaste sin intentos!"
        );

        return;
    }


    // ==================================
    // CONTINUAR
    // ==================================

    message.textContent =
        `🔎 ${correctPosition} en posición correcta y ` +
        `${correctNumber} en posición incorrecta.`;

    guessInput.value = "";

    guessInput.focus();
}


// ======================================
// MOSTRAR PISTA
// ======================================

function addClue(
    guess,
    correctPosition,
    correctNumber
) {

    const clue =
        document.createElement("div");

    clue.className = "clue";

    clue.innerHTML = `

        <span class="clue-number">
            ${guess}
        </span>

        <span>

            <span class="correct">
                🟢 ${correctPosition}
            </span>

            <br>

            <span class="position">
                🟡 ${correctNumber}
            </span>

        </span>
    `;

    history.prepend(clue);
}


// ======================================
// GANAR
// ======================================

function winGame() {

    if (gameOver) {

        return;
    }

    gameOver = true;

    clearInterval(timerInterval);

    revealSecretCode();


    // ==================================
    // CALCULAR PUNTOS
    // ==================================

    const points =
        100 +
        (attempts * 50) +
        (time * 5);

    score += points;

    scoreElement.textContent =
        score;


    message.textContent =
        `🏆 ¡CÓDIGO DESCIFRADO! +${points} puntos`;

    guessInput.disabled = true;

    checkButton.disabled = true;
}


// ======================================
// PERDER
// ======================================

function loseGame(text) {

    if (gameOver) {

        return;
    }

    gameOver = true;

    clearInterval(timerInterval);

    revealSecretCode();


    message.textContent =
        `${text} 🔐 Código correcto: ${secretCode}`;

    guessInput.disabled = true;

    checkButton.disabled = true;
}


// ======================================
// BOTON COMPROBAR
// ======================================

checkButton.addEventListener(
    "click",
    checkCode
);


// ======================================
// BOTON NUEVA PARTIDA
// ======================================

newGameButton.addEventListener(
    "click",
    startGame
);


// ======================================
// ENTER PARA COMPROBAR
// ======================================

guessInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            checkCode();
        }
    }
);


// ======================================
// CAMBIAR TIEMPO
// ======================================

timeSelect.addEventListener(
    "change",
    function() {

        // Si no estamos jugando,
        // actualizar el contador visual.

        if (!gameOver) {

            time =
                parseInt(
                    timeSelect.value,
                    10
                );

            timerElement.textContent =
                time;
        }
    }
);


// ======================================
// INICIAR AL CARGAR LA PAGINA
// ======================================

startGame();
