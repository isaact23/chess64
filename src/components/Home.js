import React from 'react';
import './Home.scss';

// The home screen, where players can start or join games.
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            joiningGame: false
        };
    }

    // Request a game from the backend
    joinGame(time, increment) {
        this.setState({'joiningGame': true});
        const settings = {time: time, increment: increment};
        this.props.socket.emit('requestGame', settings);
    }

    render() {
        return (
            <div className="homeComponent">
                <div className="mainPanel">
                    <h1>Chess 64</h1>
                    <a href="https://github.com/isaact23/chess64"><p>GitHub link</p></a>
                    <a href="https://www.youtube.com/watch?v=3rId2W7ZQkc"><p>Youtube link</p></a>
                </div>
                <div className="newGamePanel">
                    <h1>New game</h1>
                    <h2 hidden={!this.state.joiningGame}>Joining game...</h2>
                    <div hidden={true}>
                        <button id="cancelJoinGameBtn" hidden={!this.state.joiningGame}>
                            <h2>Cancel join game</h2>
                        </button>
                    </div>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(1, 0)}>
                        <p>1 + 0</p>
                        <p>Bullet</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(2, 1)}>
                        <p>2 + 1</p>
                        <p>Bullet</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 0)}>
                        <p>3 + 0</p>
                        <p>Blitz</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 2)}>
                        <p>3 + 2</p>
                        <p>Blitz</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(5, 0)}>
                        <p>5 + 0</p>
                        <p>Blitz</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(10, 0)}>
                        <p>10 + 0</p>
                        <p>Rapid</p>
                    </button>
                    <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(25, 0)}>
                        <p>25 + 0</p>
                        <p>Rapid</p>
                    </button>
                </div>
            </div>
        );
    }
}
