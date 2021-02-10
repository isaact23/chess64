import React from 'react';
import './Game.scss';
import Chessboard from "chessboardjsx";

// The gameplay screen.
export default class Game extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="gameComponent">
                <div className="chessboard">
                    <Chessboard position="start"/>
                </div>
                <div className="gameControls">
                    <h2>Controls</h2>
                    <button>
                        <p>Resign</p>
                    </button>
                </div>
            </div>
        );
    }
}