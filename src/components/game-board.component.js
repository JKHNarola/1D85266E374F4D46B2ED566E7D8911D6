import React from 'react';
import GamePlot from "./game-plot.component.js";
import GameTypeSelector from './gametype-selector.component.js';
import MatrixSizeSelector from './matrix-size-selector.component.js';
import Title from './title.component.js';

class GameBoard extends React.Component {
    constructor(props) {
        super(props);

        let boxSize = 300, blockMargin = 1, matrixSize = 5;
        this.state = {
            status: "init", //init, game, done
            gameType: "image", //image, number
            boxSize: boxSize,
            blockMargin: blockMargin,
            matrixSize: matrixSize,
            blockSize: Math.floor((boxSize - (blockMargin * 2 * matrixSize)) / matrixSize),
            image: null
        };
    }

    onImageSelect = (image) => {
        if (this.state.gameType === "image")
            this.setState({ image: image });
    };

    onGameTypeChange = (type) => {
        if (type === "number") this.setState({ image: null });
        this.setState({ gameType: type });
    };

    onStartGame = () => {
        this.setState({ status: "game" });
    };

    render = () => {
        return (
            <>
                <Title />
                {
                    this.state.status === "init" &&
                    <>
                        <MatrixSizeSelector
                            default={this.state.matrixSize}
                            onChange={(e) => { this.setState({ matrixSize: e }); }} />
                        <GameTypeSelector
                            default={this.state.gameType}
                            onChange={this.onGameTypeChange}
                            onImageSelect={this.onImageSelect} />
                        <button disabled={this.state.gameType === "image" && this.state.image === null} type="button" className="btn btn-primary" onClick={this.onStartGame}>Start</button>
                    </>
                }
                {
                    this.state.status === "game" &&
                    <GamePlot
                        matrixSize={this.state.matrixSize}
                        blockSize={this.state.blockSize}
                        blockMargin={this.state.blockMargin}
                        image={this.state.image}
                        type={this.state.gameType} />
                }
            </>
        );
    }
}

export default GameBoard;