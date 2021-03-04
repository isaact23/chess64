import React from 'react';
import './Game.scss';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

// The gameplay screen.
export default class Game extends React.Component {

    // Initialize a new game of chess.
    constructor(props) {
        super(props);
        this.chessObj = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        this.settings = this.props.settings;
        let gameTime = this.settings.time * 60000;
        // State changes throughout the game and affects the React component.
        this.state = {
            fen: this.chessObj.fen(),
            turn: "white",
            outcome: null, // win, lose, draw
            timer: {
                whiteTime: gameTime,
                blackTime: gameTime,
                startTime: new Date().getTime()
            }
        }
        // Bind functions to this class
        this.onDrop = this.onDrop.bind(this);
        this.flipTurn = this.flipTurn.bind(this);
        this.getTime = this.getTime.bind(this);
        this.updateTimer = this.updateTimer.bind(this);

        // Periodically update the timer on screen
        setInterval(this.updateTimer, 1000);
    }

    componentDidMount() {
        // Handle the other player making a move
        this.props.socket.on('makeMove', (move, timer) => {
            let clientMove = this.chessObj.move(move);
            if (clientMove === null) { return; }

            // Update timer with data from server
            this.setState({timer: timer});

            // Is game over (draw)?
            if (this.chessObj.in_draw() || // 50-move; insufficient material
                    this.chessObj.in_stalemate() ||
                    this.chessObj.in_threefold_repetition()) {
                this.setState({
                    outcome: "draw"
                });
            // Is game over (checkmate)?
            } else if (this.chessObj.in_checkmate()) {
                this.setState({
                    outcome: "lose"
                });
            } else {
                this.flipTurn();
            }
            this.setState({
                fen: this.chessObj.fen()
            });
        });
    }

    // Handle the client player making a chess move.
    onDrop = ({ sourceSquare, targetSquare }) => {
        // Cancel move if it is not our turn.
        if (this.state.turn !== this.settings.color) { return; }

        // Create new move
        let move = this.chessObj.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // TODO: Allow any type of promotion
        });

        // If move is illegal, cancel.
        if (move === null) { return; }

        this.updateTimer();

        // Update chess board
        this.setState({
            fen: this.chessObj.fen()
        });
        this.flipTurn();

        // Determine if game is over
        if (this.chessObj.game_over()) {
            this.setState({
                outcome: "win"
            });
        }

        // Send move to server
        this.props.socket.emit("makeMove", move, this.settings.sessionId);
    }

    // Change the turn to the other player.
    flipTurn() {
        if (this.state.turn === "white") {
            this.setState({turn: "black"});
        } else {
            this.setState({turn: "white"});
        }
    }

    // Return a string representing the time left for a player.
    getTime(color) {
        let time;
        if (color === "white") {
            time = this.state.timer.whiteTime;
        } else {
            time = this.state.timer.blackTime;
        }
        if (time < 0) {
            time = 0;
        }
        let min = Math.floor(time / 60000).toString();
        let sec = Math.floor((time % 60000) / 1000).toString();
        if (sec.length < 2) {
            sec = "0" + sec;
        }
        return min + ":" + sec;
    }

    // Add time between now and startTime to the player whose turn it is. Call BEFORE flipTurn().
    updateTimer() {
        let changedTimer = this.state.timer;
        let currentTime = new Date().getTime();
        let deltaTime = currentTime - this.state.timer.startTime;
        if (this.state.turn === "white") {
            changedTimer.whiteTime -= deltaTime;
        } else {
            changedTimer.blackTime -= deltaTime;
        }
        changedTimer.startTime = currentTime;
        this.setState({timer: changedTimer});
    }

    render() {
        return (
            <div className="gameComponent">
                <div className="chessboard">
                    <Chessboard
                        onDrop={this.onDrop}
                        position={this.state.fen}
                        orientation={this.settings.color}
                        boardStyle={{
                            borderRadius: "5px",
                            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                        }}
                        lightSquareStyle={{backgroundColor: "#b5c9eb"}}
                        darkSquareStyle={{backgroundColor: "#8c9cb8"}}
                    />
                </div>
                <div className="gameControls">
                    <div className="timer">
                        <div className="subTimer"><p>{this.getTime("white")}</p></div><div className="subTimer"><p>{this.getTime("black")}</p></div>
                    </div>
                    <h2>Outcome: {this.state.outcome}</h2>
                    <button id="resignBtn">
                        <p>Resign</p>
                    </button>
                </div>
            </div>
        );
    }
}