import React from 'react';
import './Game.scss';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

// The gameplay screen.
export default class Game extends React.Component {

    // Initialize a new game of chess when loading component.
    constructor(props) {
        super(props);
        let newGame = new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        this.state = {
            game: newGame,
            fen: newGame.fen(),
            settings: this.props.settings,
            myTurn: (this.props.settings.color === "white")
        }
        this.onDrop = this.onDrop.bind(this);
    }

    componentDidMount() {
        // Handle the other player making a move
        this.props.socket.on('makeMove', (move) => {
            console.log(move);
        });
    }

    onDrop = ({ sourceSquare, targetSquare }) => {
        // Cancel move if it is not our turn.
        if (!this.state.myTurn) { return; }

        // Create new move
        let move = this.state.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // TODO: Allow any type of promotion
        });

        // If move is illegal, cancel.
        if (move === null) { return; }

        // Update board
        this.setState({
            myTurn: false,
            fen: this.state.game.fen()
        });

        // Send move to server
        this.props.socket.emit("makeMove", move);
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

                    />
                </div>
                <div className="gameControls">
                    <h2>Controls</h2>
                    <p>Room:</p>
                    <button>
                        <p>Resign</p>
                    </button>
                </div>
            </div>
        );
    }
}