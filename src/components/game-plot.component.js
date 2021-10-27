import React from 'react';
import { playMoveBlockSound } from '../service';
import Block from './block.component';
import MessageBox from './messagebox.component';
import ShufflingLoader from './shuffling-loader';

export class GamePlot extends React.Component {
    constructor(props) {
        super(props);

        let stateObj = {
            boxSize: (this.props.blockSize + (this.props.blockMargin * 2)) * this.props.matrixSize + "px",
            gameMatrix: [],
            gameMatrixBack: [],
            marginpix: this.props.blockMargin * 2,
            shuffleMoves: this.props.shuffleMoves,
            blankBlockNo: -1,
            shuffleStatus: "unshuffled",
            blockFixedStyle: {
                height: this.props.blockSize + "px",
                width: this.props.blockSize + "px",
                margin: this.props.blockMargin + "px",
                lineHeight: this.props.blockSize + "px",
                opacity: 1,
                color: this.props.type !== "image" ? "black" : "transparent"
            },
            isGameFinished: false
        };
        if (this.props.type !== "number") {
            stateObj.blockFixedStyle.backgroundImage = this.props.image;
            stateObj.blockFixedStyle.backgroundSize = ((this.props.blockSize + this.props.blockMargin * 2) * this.props.matrixSize) + (this.props.blockSize + this.props.blockMargin * 2) + "px";
        }
        this.state = stateObj;
    }

    componentDidMount = () => {
        this.generateGameMatrix();


        setTimeout(() => {
            document.getElementById("gameplot").style.opacity = 1;
        }, 200);

        setTimeout(() => {
            this.shuffle();
        }, 1000);
    };

    componentWillUnmount = () => {
        if (this.props.image) URL.revokeObjectURL(this.props.image);
    };

    getBlockSizeWithMargin = () => {
        return this.props.blockSize + this.state.marginpix;
    };

    generateGameMatrix = () => {
        let gameMatrix = [];
        for (let y = 1; y <= this.props.matrixSize; y++) {
            let arr = [];
            for (let x = 1; x <= this.props.matrixSize; x++) {
                let no = x + ((this.props.matrixSize * y) - this.props.matrixSize);
                arr.push({
                    no: no,
                    isBlank: false,
                    style: {
                        left: (x - 1) * this.getBlockSizeWithMargin(),
                        top: (y - 1) * this.getBlockSizeWithMargin(),
                        backgroundPosition: this.props.type !== "number" ? ((x - 1) * 100 / this.props.matrixSize) + "% " + ((y - 1) * 100 / this.props.matrixSize) + "%" : "none"
                    }
                });
            }
            gameMatrix.push(arr);
        }
        gameMatrix[this.props.matrixSize - 1][this.props.matrixSize - 1].isBlank = true;
        this.setState({
            gameMatrix: gameMatrix,
            blankBlockNo: gameMatrix[this.props.matrixSize - 1][this.props.matrixSize - 1].no,
            gameMatrixBack: Object.assign([], gameMatrix),
            shuffleStatus: "unshuffled",
            isGameFinished: false
        });
    };

    getBlankBlock = () => {
        return Array.from(document.getElementsByClassName("blank"))[0];
    };

    onBlockClick = (e) => {
        if (this.state.isGameFinished) return;

        let isBlank = e.target.getAttribute('data-isblank') === "true";
        if (isBlank) return;

        let blankBlock = this.getBlankBlock();

        let top = parseInt(e.target.style.top.replace("px", ""));
        let left = parseInt(e.target.style.left.replace("px", ""));

        let blankTop = parseInt(blankBlock.style.top.replace("px", ""));
        let blankLeft = parseInt(blankBlock.style.left.replace("px", ""));

        let delta = this.getBlockSizeWithMargin();

        let no = parseInt(e.target.innerHTML);

        //Move down
        if (blankTop - delta === top && blankLeft === left) {
            this.moveBlock(no, "down");
            this.moveBlock(this.state.blankBlockNo, "up");
            if (this.props.onMove) this.props.onMove();
        }

        //Move right
        else if (blankTop === top && blankLeft - delta === left) {
            this.moveBlock(no, "right");
            this.moveBlock(this.state.blankBlockNo, "left");
            if (this.props.onMove) this.props.onMove();
        }

        //Move up
        else if (blankTop + delta === top && blankLeft === left) {
            this.moveBlock(no, "up");
            this.moveBlock(this.state.blankBlockNo, "down");
            if (this.props.onMove) this.props.onMove();
        }

        //Move left
        else if (blankTop === top && blankLeft + delta === left) {
            this.moveBlock(no, "left");
            this.moveBlock(this.state.blankBlockNo, "right");
            if (this.props.onMove) this.props.onMove();
        }
    };

    moveBlock = (blockNo, move, isShuffle) => {
        let movepix = this.getBlockSizeWithMargin();
        this.setState(prevState => ({
            gameMatrix: prevState.gameMatrix.map(arr =>
                arr.map(ele =>
                    ele.no === blockNo ?
                        {
                            ...ele,
                            style:
                            {
                                ...ele.style,
                                top: move === "up" ? ele.style.top - movepix : move === "down" ? ele.style.top + movepix : ele.style.top,
                                left: move === "left" ? ele.style.left - movepix : move === "right" ? ele.style.left + movepix : ele.style.left
                            }
                        }
                        : ele
                )
            )
        }), () => {
            if (!isShuffle && this.state.blankBlockNo === blockNo && this.checkGameWon())
                this.onGameWon();
        });

        if (!isShuffle)
            playMoveBlockSound();
    };

    shuffleSingleBlock = () => {
        let blankBlock = this.getBlankBlock();
        let bTop = parseInt(blankBlock.style.top.replace("px", ""));
        let bLeft = parseInt(blankBlock.style.left.replace("px", ""));

        let delta = this.getBlockSizeWithMargin();
        let surBlocks = [];

        //TODO: make this faster
        this.state.gameMatrix.forEach(arr => {
            arr.forEach(b => {
                if (b.style.left === bLeft - delta && b.style.top === bTop) surBlocks.push({ no: b.no, move: "right", pos: "left" });
                else if (b.style.left === bLeft + delta && b.style.top === bTop) surBlocks.push({ no: b.no, move: "left", pos: "right" });
                else if (b.style.left === bLeft && b.style.top === bTop - delta) surBlocks.push({ no: b.no, move: "down", pos: "up" });
                else if (b.style.left === bLeft && b.style.top === bTop + delta) surBlocks.push({ no: b.no, move: "up", pos: "down" });
            });
        });

        let ranIndex = Math.floor(Math.random() * surBlocks.length);
        this.moveBlock(surBlocks[ranIndex].no, surBlocks[ranIndex].move, true);
        this.moveBlock(parseInt(blankBlock.innerHTML), surBlocks[ranIndex].pos, true);
    };

    shuffle = () => {
        this.setState({ shuffleStatus: "shuffling" });
        this.intervalCnt = 0;
        this.shuffleInterval = setInterval(() => {
            if (this.intervalCnt === this.state.shuffleMoves) {
                if (this.checkGameWon()) {
                    this.intervalCnt = 0;
                    return;
                }
                clearInterval(this.shuffleInterval);
                this.intervalCnt = 0;
                this.setState({ shuffleStatus: "shuffled" });
                if (this.props.onGameStarted) this.props.onGameStarted();
                return;
            }
            this.shuffleSingleBlock();
            this.intervalCnt++;
        }, 50);
    };

    checkGameWon = () => {
        return JSON.stringify(this.state.gameMatrix) === JSON.stringify(this.state.gameMatrixBack);
    };

    onGameWon = () => {
        if (this.props.onGameFinished) this.props.onGameFinished();
        this.setState({ isGameFinished: true });
        MessageBox.success("Won", "You won the game!!", true);
    };

    render = () => {
        return <div id="gameplot" className={"game-plot " + this.state.shuffleStatus} style={{ height: this.state.boxSize, width: this.state.boxSize }}>
            {
                this.state.gameMatrix.map((arr, i) => {
                    return <React.Fragment key={i}>
                        {
                            arr.map((block, j) => {
                                return <Block style={{ ...this.state.blockFixedStyle, ...block.style }} x={i} y={j} key={block.no} isBlank={block.isBlank} onClick={this.onBlockClick}>{block.no}</Block>
                            })
                        }
                    </ React.Fragment>
                })
            }
            {
                this.state.shuffleStatus === "shuffling" &&
                <ShufflingLoader boxSize={this.state.boxSize} />
            }
        </div >;
    };
}

export default GamePlot;