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

// Rooms with 1 player
let openRooms = {
    0: {time: 5, increment: 0},
    1: {time: 1, increment: 1}
};
let nextRoom = 0; // Increment by 1 every time a room is created

// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('connection', null);

    socket.on('playGame', handlePlayGame);

    // Handle a player request to play chess
    function handlePlayGame(settings) {
        console.log("Play game request");
        // Leave all rooms
        for (var room in socket.rooms) {
            socket.leave(room);
        }
        // Look for open rooms
        let selectedRoom = -1;
        for (var roomNo in openRooms) {
            // Find rooms with the same time and increment as requested
            if (openRooms[roomNo].time === settings.time && openRooms[roomNo].increment === settings.increment) {
                // TODO: Verify the room still exists / hasn't been taken
                selectedRoom = roomNo;
                break;
            }
        }
        // If no room was found, create a new room and join it
        if (selectedRoom === -1) {
            console.log("Creating new room");
            openRooms[nextRoom] = {
                time: settings.time,
                increment: settings.increment
            }
            socket.join(nextRoom);
            nextRoom += 1;
        }
        // If a room was found, join it and start the game
        else {
            console.log("Joining room and starting game");
            delete openRooms[selectedRoom];
            socket.join(selectedRoom);
            // Notify all clients that game has started
            io.in(selectedRoom).emit('startGame', settings);
        }
    }
});

// Open http server to requests
const PORT = 5000;
server.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})