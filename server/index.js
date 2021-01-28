// We will probably need CORS (cross-origin)

// Initialize express app
const app = require('express')();
// Initialize http server
const server = require('http').createServer(app);
// Initialize socket.io
const io = require('socket.io')(server);

// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log("User connected");

    socket.on('playGame', handlePlayGame);

    // Handle a player request to play chess
    function handlePlayGame() {

    }
});

// Open http server to requests
const port = 5000;
server.listen(port, () => {
    console.log('Listening on port ', port);
})