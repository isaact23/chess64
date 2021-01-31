import React from 'react';
import './Home.scss';

// The home screen, where players can start or join games.
export default class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            joiningGame: false
        };
        console.log("HEY!");
    }

    // Request a game from the backend
    joinGame(time, increment) {
        this.setState({'joiningGame': true});
        this.props.socket.emit('playGame', time, increment);
    }

    render() {
        return (
            <div className="homeComponent">
                <div className="allColumns">
                    <div className="column">
                        <h1>New game</h1>
                        <h2 hidden={!this.state.joiningGame}>Joining game...</h2>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(1, 0)}>
                            <p>1 + 0</p>
                        </button>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(2, 1)}>
                            <p>2 + 1</p>
                        </button>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 0)}>
                            <p>3 + 0</p>
                        </button>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(3, 2)}>
                            <p>3 + 2</p>
                        </button>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(5, 0)}>
                            <p>5 + 0</p>
                        </button>
                        <button disabled={this.state.joiningGame} onClick={() => this.joinGame(5, 3)}>
                            <p>5 + 3</p>
                        </button>
                    </div>
                    <div className="column">
                        <h1>Join game</h1>
                        <div className="joinBtn"><p>Game 1</p></div>
                        <div className="joinBtn"><p>Game 2</p></div>
                    </div>
                </div>
                <footer>
                    <div className="navBtn"><h2>About</h2></div>
                </footer>
            </div>
        );
    }
}