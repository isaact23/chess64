import React from 'react';
import './Game.scss';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

// The gameplay screen.
export default class Game extends React.Component {

    // Initialize a new game of chess.
    constructor(props) {
        super(props);
        let chessObj = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        this.date = new Date();
        this.settings = this.props.settings;
        this.state = {
            fen: chessObj.fen(),
            chessObj: chessObj,
            currentTurn: "white",
            outcome: null, // win, lose, draw
            timer: {
                whiteTime: 0,
                blackTime: 0,
                startTime: this.date.getTime()
            }
        }
        this.onDrop = this.onDrop.bind(this);
        this.flipTurn = this.flipTurn.bind(this);
        this.getTime = this.getTime.bind(this);
    }

    componentDidMount() {
        // Handle the other player making a move
        this.props.socket.on('makeMove', (move) => {
            let clientMove = this.state.chessObj.move(move);
            if (clientMove === null) { return; }
            // Is game over (draw)?
            if (this.state.chessObj.in_draw() || // 50-move; insufficient material
                    this.state.chessObj.in_stalemate() ||
                    this.state.chessObj.in_threefold_repetition()) {
                this.setState({
                    outcome: "draw"
                });
            // Is game over (checkmate)?
            } else if (this.state.chessObj.in_checkmate()) {
                this.setState({
                    outcome: "lose"
                });
            } else {
                this.flipTurn();
            }
            this.setState({
                fen: this.state.chessObj.fen()
            });
        });
    }

    onDrop = ({ sourceSquare, targetSquare }) => {
        // Cancel move if it is not our turn.
        if (this.state.currentTurn !== this.state.color) { return; }

        // Create new move
        let move = this.state.chessObj.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // TODO: Allow any type of promotion
        });

        // If move is illegal, cancel.
        if (move === null) { return; }

        // Update chess board
        this.setState({
            fen: this.state.chessObj.fen()
        });
        this.flipTurn();

        // Determine if game is over
        if (this.state.chessObj.game_over()) {
            this.setState({
                outcome: "win"
            });
        }

        // Send move to server
        this.props.socket.emit("makeMove", move, this.state.settings.sessionId);
    }

    // Change the turn to the other player.
    flipTurn() {
        if (this.state.currentTurn === "white") {
            this.setState({currentTurn: "black"});
        } else {
            this.setState({currentTurn: "white"});
        }
    }

    // Return a string representing the time left for a player.
    getTime(color) {
        if (color === "white") {
            if (this.settings.color === "white") {

            }
        }
    }

    render() {
        return (
            <div className="gameComponent">
                <div className="chessboard">
                    <Chessboard
                        onDrop={this.onDrop}
                        position={this.state.fen}
                        orientation={this.state.settings.color}
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