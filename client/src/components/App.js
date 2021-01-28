import React from 'react';
import './App.scss';
import Home from './Home';
const io = require('socket.io');

// The App component contains all pages within the website.
export default class App extends React.Component {

    // Initialize the App component
    constructor(props) {
        super(props);

        // Connect to server
        this.socket = io.connect('http://localhost:5000/');

        // Bind functions
        this.getCurrentPage = this.getCurrentPage.bind(this);
    }

    // Initialize io listeners
    componentDidMount() {

    }

    // Get the page the user is currently on
    getCurrentPage() {
        return <Home/>;
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