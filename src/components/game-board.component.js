import React from 'react';
import BrowseAndCropImage from "./browse-file.component.js";
import GamePlot from "./game-plot.component.js";
import Title from './title.component.js';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        let boxSize = 300, blockMargin = 1, matrixSize = 5;
        this.state = {
            status: "init", //init, game, done
            gameType: "image", //image, number, imageWithNumber
            boxSize: boxSize,
            blockMargin: blockMargin,
            matrixSize: matrixSize,
            blockSize: Math.floor((boxSize - (blockMargin * 2 * matrixSize)) / matrixSize),
            image: null
        };
    }

    onImageSelected = (fileUrl) => {
        this.setState({ status: "game", image: 'url("' + fileUrl + '")' });
    };

    render = () => {
        return (
            <>
                <Title />
                {this.state.status === "init" && <BrowseAndCropImage onImageSelected={this.onImageSelected} />}
                {this.state.status === "game" && <GamePlot matrixSize={this.state.matrixSize} blockSize={this.state.blockSize} blockMargin={this.state.blockMargin} image={this.state.image} type={this.state.gameType} />}
            </>
        );
    }
}

export default GameBoard;