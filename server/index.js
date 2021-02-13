const randomString = require('./randomString');

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

// Requests for a room
let requests = [];

// Every few seconds, iterate through game requests and pair up players.
let pairInterval = setInterval(function() {
    let startIndex = 0;

    // Repeat the loop until there are either less than 2 requests or no more requests can be paired.
    while (requests.length > 1 && startIndex < requests.length - 1) {
        let request1 = requests[startIndex];
        let foundPair = false;

        // Try to pair the request at startIndex with any subsequent request.
        for (let i = startIndex + 1; i < requests.length; i++) {
            let request2 = requests[i];

            // If the requested settings for each player matches, pair them up and remove from requests.
            // TODO: Try reducing this to request1.settings === request2.settings
            if (request1.settings.time === request2.settings.time && request1.settings.increment === request2.settings.increment) {

                // TODO: Ensure nobody is already in this room
                // TODO: Ensure both players are still logged in (requests still valid)
                let roomName = randomString(10);

                // Remove sockets from all room; add to new room for this game
                request1.socket.leaveAll();
                request2.socket.leaveAll();
                request1.socket.join(roomName);
                request2.socket.join(roomName);

                // Randomly choose colors for player
                let color1, color2;
                if (Math.random() < 0.5) {
                    color1 = "white";
                    color2 = "black";
                } else {
                    color1 = "black";
                    color2 = "white";
                }

                // Inform clients that game has started
                request1.socket.emit('startGame',
                    {time: request1.settings.time, increment: request1.settings.increment, color: color1});
                request2.socket.emit('startGame',
                    {time: request1.settings.time, increment: request1.settings.increment, color: color2});

                // Remove both requests
                requests.splice(i, 1);
                requests.splice(startIndex, 1);

                console.log("Paired " + i + " and " + startIndex);
                foundPair = true;
                break;
            }
        }
        // If the request at startIndex did not have a pair, increment startIndex.
        if (!foundPair) {
            startIndex++;
        }
    }
}, 1000);


// Event 'connection' creates a socket from the requesting client
io.on('connection', (socket) => {
    console.log('User connected');
    socket.emit('connection', null);

    socket.on('requestGame', handleRequestGame);

    // Handle a player request to play chess
    function handleRequestGame(settings) {
        console.log("Game requested, time " + settings.time + ", increment " + settings.increment);

        // Leave all rooms
        for (var room in socket.rooms) {
            socket.leave(room);
        }

        // Add request to request list
        requests.push({socket: socket, settings: settings});
    }
});

// Open http server to requests
const PORT = 5000;
server.listen(PORT, () => {
    console.log('Listening on port ', PORT);
})