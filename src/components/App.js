import React from 'react';
import './App.scss';
import Home from './Home';
import Game from './Game';

const io = require("socket.io-client");
const socket = io();

// The App component contains all pages within the website.
export default class App extends React.Component {

    // Initialize the App component
    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            settings: null // Game-specific settings like time and increment
        };

        // Bind functions
        this.getCurrentPage = this.getCurrentPage.bind(this);
    }

    // Initialize io listeners
    componentDidMount() {
        // Connection with server verified
        socket.on('connection', () => {

        });

        // Server starts a game.
        // Room joining is handled on server side.
        socket.on('startGame', (settings) => {
            this.setState({
                playing: true,
                settings: settings
            });
        });
    }

    // Get the page the user is currently on
    getCurrentPage() {
        if (this.state.playing) {
            return <Game socket={socket} settings={this.state.settings} />
        } else {
            return <Home socket={socket}/>;
        }
    }

    // Render the entire website
    render() {
        return (
            <div className="App">
                <header>
                    <h1>Chess 64</h1>
                    <h2>About</h2>
                </header>
                {this.getCurrentPage()}
            </div>
        );
    }
}