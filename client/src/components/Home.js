import React from 'react';
import './Home.scss';

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <h1>Chess 64</h1>
                </header>
                <div className="allColumns">
                    <div className="column">
                        <h1>New game</h1>
                        <div className="playBtn"><p>1 + 0</p></div>
                        <div className="playBtn"><p>2 + 1</p></div>
                        <div className="playBtn"><p>3 + 0</p></div>
                        <div className="playBtn"><p>3 + 2</p></div>
                        <div className="playBtn"><p>5 + 0</p></div>
                        <div className="playBtn"><p>5 + 3</p></div>
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