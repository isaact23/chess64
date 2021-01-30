// We will probably need CORS (cross-origin)

// Initialize express/http/socket stack
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

var openRooms = {};
var closedRooms = {};

// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('connection', null);

    socket.on('playGame', handlePlayGame);

    // Handle a player request to play chess
    function handlePlayGame(time, increment) {
        console.log("Play game request");

        // TODO: Wait until a room is found
        socket.emit('startGame');
    }
});

// Open http server to requests
const PORT = 5000;
server.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})