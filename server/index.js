const handleRequests = require('./handleRequests');

// Initialize express/http/socket stack
const express = require('express');
const path = require('path');
//const index = require('./build/index.html');
const app = express();
const io = require('socket.io')();

app.use(express.static(path.join(__dirname, 'build', 'index.html')));

// TODO: Add a script that runs every hour, removing old rooms from openRooms

// Running games
let games = {};
function addGame(room, game) {
    games[room] = game;
}

// Requests for a game
let requests = [];
handleRequests(requests);
// Every few seconds, iterate through game requests and pair up players.
let handleRequestInterval = setInterval(function() { handleRequests(requests, addGame); }, 1000);


// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('connection', null);

    socket.on('requestGame', handleRequestGame);

    // Handle a player request to play chess
    function handleRequestGame(settings) {
        console.log("Game requested, time " + settings.time + ", increment " + settings.increment);

        // Add request to request list
        requests.push({socket: socket, settings: settings});
    }
});

// Open server to requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.listen(80);