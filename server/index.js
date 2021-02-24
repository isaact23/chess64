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
function addGame(room, game) {
    games[room] = game;
}

// Store and handle game requests
let requests = [];
setInterval(function() { handleRequests(requests, addGame); }, 1000);


// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log("User connected");
    socket.emit('connection', null);

    socket.on('requestGame', handleRequestGame);
    socket.on('makeMove', handleMakeMove);

    // Handle a player request to play chess
    async function handleRequestGame(settings) {
        console.log("Game requested, time " + settings.time + ", increment " + settings.increment);

        // Add request to request list
        requests.push({socket: socket, settings: settings});
    }

    // Handle a player making a move (verify move and send to other player)
    async function handleMakeMove(move, room) {
        let game = games[room];

        // Verify that the move is legal
        let chessObj = game["chessObj"];
        let serverMove = chessObj.move(move);
        if (serverMove === null) {
            return; // TODO: Emit win/lose messages; terminate game
        }

        // Send move to other player
        if (serverMove.color === 'w') {
            game.socket2.emit('makeMove', move);
        } else if (serverMove.color === 'b') {
            game.socket1.emit('makeMove', move);
        } else {
            console.log("Error! No color detected.");
        }
    }
});

// Open server to requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
let PORT = process.env.PORT || 5000;
server.listen(PORT);
console.log("Listening on " + PORT);