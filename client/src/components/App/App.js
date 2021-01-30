import React from 'react';
import './App.scss';
import Home from './Home';

const io = require("socket.io-client");
const socket = io("http://localhost:5000");

// The App component contains all pages within the website.
export default class App extends React.Component {

    // Initialize the App component
    constructor(props) {
        super(props);

        // Bind functions
        this.getCurrentPage = this.getCurrentPage.bind(this);
    }

    // Initialize io listeners
    componentDidMount() {
        // Receive message from server that connection request is received
        socket.on('connection', () => {
            // TODO: Find out why this doesn't print. Issue affects all client-side console.log statements.
            console.log("Connected to server successfully");
        });
    }

    // Get the page the user is currently on
    getCurrentPage() {
        return <Home socket={socket}/>;
    }

    // Render the entire website
    render() {
        return (
            <div className="App">
                {this.getCurrentPage()}
            </div>
        );
    }
}