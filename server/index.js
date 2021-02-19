const handleRequests = require('./handleRequests');

// Initialize express/http/socket stack
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

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

// Open http server to requests
const PORT = 5000;
server.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})