// Import modules
const handleRequests = require('./handleRequests');
const Chess = require('chess.js');

// Import network requirements
const socketIo = require('socket.io');
const express = require('express');
const path = require('path');
const http = require("http");

// Initialize express and middleware
const app = express();
app.use(express.static("build"));

// Initialize http server
const server = http.createServer(app);

// Initialize socket.io
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});;


// TODO: Add a script that runs every hour, removing old rooms from openRooms

// Store running games
let games = {};
function addGame(room, game) {
    games[room] = game;
}

// Store and handle game requests
let requests = [];
handleRequests(requests);
// Every few seconds, iterate through game requests and pair up players.
let handleRequestInterval = setInterval(function() { handleRequests(requests, addGame); }, 1000);


// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('connection', null);

    socket.on('requestGame', handleRequestGame);
    socket.on('makeMove', handleMakeMove);

    // Handle a player request to play chess
    function handleRequestGame(settings) {
        console.log("Game requested, time " + settings.time + ", increment " + settings.increment);

        // Add request to request list
        requests.push({socket: socket, settings: settings});
    }

    // Handle a player making a move (verify move and send to other player)
    function handleMakeMove() {
        console.log("Handling move");
    }
});

// Open server to requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
server.listen(5000);