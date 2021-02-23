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
                <div className="allColumns">
                    <div className="column">
                        <h1>New game</h1>
                        <h2 hidden={!this.state.joiningGame}>Joining game...</h2>
                        <button id="cancelJoinGameBtn" hidden={!this.state.joiningGame}>
                            <h2>Cancel join game</h2>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(1, 0)}>
                            <p>1 + 0</p>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(2, 1)}>
                            <p>2 + 1</p>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 0)}>
                            <p>3 + 0</p>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 2)}>
                            <p>3 + 2</p>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(5, 0)}>
                            <p>5 + 0</p>
                        </button>
                        <button id="timeControlBtn" disabled={this.state.joiningGame} onClick={() => this.joinGame(5, 3)}>
                            <p>5 + 3</p>
                        </button>
                    </div>
                    <div className="column">
                        <h1>Join game</h1>
                        <div className="joinBtn"><p>Coming</p></div>
                        <div className="joinBtn"><p>Soon</p></div>
                    </div>
                </div>
                <footer>
                    <div className="navBtn"><h2>About</h2></div>
                </footer>
            </div>
        );
    }
}