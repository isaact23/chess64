import React from 'react';
import './Game.scss';
import Chessboard from "chessboardjsx";
import Chess from "chess.js";

// The gameplay screen.
export default class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            game: new Chess("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),
            settings: this.props.settings,
            myTurn: (this.props.settings.color === "white")
        }
    }

    onDrop = ({ sourceSquare, targetSquare }) => {

    }

    render() {
        return (
            <div className="gameComponent">
                <div className="chessboard">
                    <Chessboard
                        onDrop={this.onDrop}
                        position={this.state.game.fen}
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