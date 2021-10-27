import React from 'react';
import GamePlot from "./game-plot.component.js";
import GameTypeSelector from './gametype-selector.component.js';
import MatrixSizeSelector from './matrix-size-selector.component.js';
import Moves from './moves.component.js';
import Timer from './timer.component.js';
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
            image: null,
            isGameStarted: false,
            moves: 0,
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

    onGameStarted = () => {
        this.setState({ isGameStarted: true });
    };

    onGameFinished = () => {
        this.setState({ isGameStarted: false, status: "done" });
    };

    onMoveBlock = () => {
        this.setState(prev => ({ moves: prev.moves + 1 }));
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
                        <div className="row mt-3">
                            <div className="col-sm-12">
                                <button disabled={this.state.gameType === "image" && this.state.image === null} type="button" className="btn btn-primary" onClick={this.onStartGame}>Start</button>
                            </div>
                        </div>
                    </>
                }
                {
                    this.state.status === "game" &&
                    <>
                        <Timer isStart={this.state.isGameStarted} />
                        <GamePlot
                            matrixSize={this.state.matrixSize}
                            blockSize={this.state.blockSize}
                            blockMargin={this.state.blockMargin}
                            shuffleMoves={this.state.matrixSize * 50}
                            image={this.state.image}
                            type={this.state.gameType}
                            onMove={this.onMoveBlock}
                            onGameStarted={this.onGameStarted}
                            onGameFinished={this.onGameFinished} />
                        <Moves count={this.state.moves} />
                    </>
                }
            </>
        );
    }
}

export default GameBoard;