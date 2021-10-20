import React from 'react';
import BrowseFile from "./browse-file.component.js";
import GamePlot from "./game-plot.component.js";
import Title from './title.component.js';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "game"
        };
    }

    onFileSelected = () => {

    };

    render = () => {
        return (
            <>
                <Title />
                {this.state.status === "init" && <BrowseFile onFileSelected={this.onFileSelected} />}
                {this.state.status === "game" && <GamePlot matrixSize={5} blockSize={50} blockMargin={1} />}
            </>
        );
    }
}

export default GameBoard;