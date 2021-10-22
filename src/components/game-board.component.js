import React from 'react';
import BrowseFile from "./browse-file.component.js";
import GamePlot from "./game-plot.component.js";
import Title from './title.component.js';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        let boxSize = 300, blockMargin = 1, matrixSize = 5;
        this.state = {
            status: "game", //init, game, done
            gameType: "image", //image, number, imageWithNumber
            boxSize: boxSize,
            blockMargin: blockMargin,
            matrixSize: matrixSize,
            blockSize: Math.floor((boxSize - (blockMargin * 2 * matrixSize)) / matrixSize),
            image: 'url("/sample-images/1.jpg")'
        };
    }

    onFileSelected = () => {

    };

    render = () => {
        return (
            <>
                <Title />
                {this.state.status === "init" && <BrowseFile onFileSelected={this.onFileSelected} />}
                {this.state.status === "game" && <GamePlot matrixSize={this.state.matrixSize} blockSize={this.state.blockSize} blockMargin={this.state.blockMargin} image={this.state.image} type={this.state.gameType} />}
            </>
        );
    }
}

export default GameBoard;