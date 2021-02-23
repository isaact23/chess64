const randomString = require('./randomString');
const { Chess } = require('chess.js')

// Given an array of requests for games, iterate through the array and pair
// up requests with the same game settings, and initialize these games.
async function handleRequests(requests, addGame) {
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

                // Randomly choose colors for player
                let socket1, socket2; // White and black sockets respectively
                if (Math.random() < 0.5) {
                    socket1 = request1.socket;
                    socket2 = request2.socket;
                } else {
                    socket1 = request2.socket;
                    socket2 = request1.socket;
                }

                // Remove sockets from all room; add to new room for this game
                socket1.leaveAll();
                socket2.leaveAll();
                socket1.join(roomName);
                socket2.join(roomName);
                
                // Keep game data on server side
                let newChess = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
                let gameData = {socket1: socket1, socket2: socket2, chess: newChess}
                addGame(roomName, gameData);

                // Inform clients that game has started
                socket1.emit('startGame',
                    {time: request1.settings.time, increment: request1.settings.increment, room: roomName, color: "white"});
                socket2.emit('startGame',
                    {time: request1.settings.time, increment: request1.settings.increment, room: roomName, color: "black"});

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
}

module.exports = handleRequests;