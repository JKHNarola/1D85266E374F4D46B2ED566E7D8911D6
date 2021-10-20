import "animate.css";
import React from 'react';
import ReactDOM from 'react-dom';
import GameBoard from "./components/game-board.component.js";
import { MessageBoxContainer } from './components/messagebox.component.js';

class App extends React.Component {
    render = () => {
        return (
            <>
                <div className="container">
                    <GameBoard />
                </div>
                <MessageBoxContainer />
            </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));
