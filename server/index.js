// Import modules
const handleRequests = require('./handleRequests');

// Import network requirements
const socketIo = require('socket.io');
const express = require('express');
const path = require('path');
const http = require("http");
var helmet = require('helmet');

// Initialize express and middleware
const app = express();
app.use(express.static("build"));
app.use(helmet());

// Initialize http server
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


// TODO: Add a script that runs every hour, removing old rooms from openRooms

// Store running games
let games = {};
function addGame(sessionId, gameData) {
    games[sessionId] = gameData;
}

// Store and handle game requests
let requests = [];
setInterval(function() { handleRequests(requests, addGame); }, 1000);

// Update timer. Call BEFORE switching turns.
// TODO: Add increment
function updateTimer(gameData) {
    let currentTime = new Date().getTime();
    let deltaTime = currentTime - gameData.timer.startTime;
    if (gameData.turn === "white") {
        gameData.timer.whiteTime -= deltaTime;
    } else {
        gameData.timer.blackTime -= deltaTime
    }
    gameData.timer.startTime = currentTime;
}

// Flip turn from white to black or vice versa
function flipTurn(gameData) {
    if (gameData.turn === "white") {
        gameData.turn = "black";
    } else {
        gameData.turn = "white";
    }
}

// End a game.
function endGame(gameData, sessionId, outcome) {
    gameData.socket1.emit("endGame", outcome);
    gameData.socket2.emit("endGame", outcome);
    delete games[sessionId];
    console.log("Ended game");
}

// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log("User connected");
    socket.emit('connection', null);

    socket.on('requestGame', handleRequestGame);
    socket.on('makeMove', handleMakeMove);
    socket.on('checkTime', handleCheckTime);
    socket.on('resign', handleResign);

    // Handle a player request to play chess
    async function handleRequestGame(settings) {
        console.log("Game requested, time " + settings.time + ", increment " + settings.increment);

        // Add request to request list
        requests.push({socket: socket, settings: settings});
    }

    // Handle a player making a move (verify move and send to other player)
    async function handleMakeMove(move, sessionId) {
        let gameData = games[sessionId];
        if (gameData === undefined) { return; }
        if (!(gameData.socket1.id === socket.id || gameData.socket2.id === socket.id)) { return; }

        // Verify that the move is legal
        let chessObj = gameData.chessObj;
        let serverMove = chessObj.move(move);
        if (serverMove === null) {
            return; // TODO: Emit win/lose messages; terminate game
        }

        updateTimer(gameData);
        flipTurn(gameData);

        // Send move to other player
        if (serverMove.color === 'w') {
            gameData.socket2.emit('makeMove', move);
        } else if (serverMove.color === 'b') {
            gameData.socket1.emit('makeMove', move);
        } else {
            console.log("Error! No color detected.");
        }

        // Send time data to both players
        gameData.socket1.emit("updateTimer", gameData.timer);
        gameData.socket2.emit("updateTimer", gameData.timer);

        // If the game is finished, inform clients and terminate game.
        let outcome;
        let gameOver = false;
        // Is game over (draw)?
        if (chessObj.in_draw() || // 50-move; insufficient material
                chessObj.in_stalemate() ||
                chessObj.in_threefold_repetition()) {
            gameOver = true;
            outcome = "draw";
        }
        // Is game over (checkmate)?
        else if (chessObj.in_checkmate()) {
            gameOver = true;
            if (gameData.turn === "white") {
                outcome = "black_wins";
            } else if (gameData.turn === "black") {
                outcome = "white_wins";
            }
        }
        if (gameOver) {
            endGame(gameData, sessionId, outcome);
        }
    }

    // Check timer; if time's up, end the game. Else, update clients on time remaining.
    async function handleCheckTime(sessionId) {
        let gameData = games[sessionId];
        if (gameData === undefined) { return; }

        updateTimer(gameData); // Get timer up to date

        let gameOver = false;
        let outcome;
        if (gameData.timer.whiteTime <= 0) {
            gameOver = true;
            outcome = "black_wins";
        } else if (gameData.timer.blackTime <= 0) {
            gameOver = true;
            outcome = "white_wins";
        }
        if (gameOver) {
            endGame(gameData, sessionId, outcome);
        } else {
            gameData.socket1.emit("updateTimer", gameData.timer);
            gameData.socket2.emit("updateTimer", gameData.timer);
        }
    }

    // Handle a player resigning.
    async function handleResign(sessionId) {
        let gameData = games[sessionId];
        if (gameData === undefined) { return; }

        let outcome;
        if (gameData.socket1.id === socket.id) {
            outcome = "black_wins";
        } else if (gameData.socket2.id === socket.id) {
            outcome = "white_wins";
        } else {
            return;
        }

        endGame(gameData, sessionId, outcome);
    }
});

// Open server to requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
let PORT = process.env.PORT || 5000;
server.listen(PORT);
console.log("Listening on " + PORT);