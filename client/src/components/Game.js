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
                <Chessboard position="start"/>
            </div>
        );
    }
}