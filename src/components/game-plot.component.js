import React from 'react';
import Block from './block.component';

export class GamePlot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boxSize: (this.props.blockSize + (this.props.blockMargin * 2)) * this.props.matrixSize + "px",
            animatespeed: 50,
            shuffleAnimateSpeed: 50,
            gameMatrix: [],
            marginpix: this.props.blockMargin * 2,
            shuffleMoves: this.props.matrixSize * 100,
            blankBlockNo: -1
        };
    }

    componentDidMount = () => {
        this.generateGameMatrix();
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
                        height: this.props.blockSize + "px",
                        width: this.props.blockSize + "px",
                        margin: this.props.blockMargin + "px",
                        lineHeight: this.props.blockSize + "px",
                        left: (x - 1) * (this.props.blockSize + this.state.marginpix),
                        top: (y - 1) * (this.props.blockSize + this.state.marginpix),
                        opacity: 1
                    }
                });
            }
            gameMatrix.push(arr);
        }
        gameMatrix[this.props.matrixSize - 1][this.props.matrixSize - 1].isBlank = true;
        this.setState({ gameMatrix: gameMatrix });
        this.setState({ blankBlockNo: gameMatrix[this.props.matrixSize - 1][this.props.matrixSize - 1].no });
    };

    getBlankBlock = () => {
        return Array.from(document.getElementsByClassName("blank"))[0];
    }

    onBlockClick = (e) => {
        let isBlank = e.target.getAttribute('data-isblank') === "true";
        if (isBlank) return;

        let blankBlock = this.getBlankBlock();

        let top = parseInt(e.target.style.top.replace("px", ""));
        let left = parseInt(e.target.style.left.replace("px", ""));

        let blankTop = parseInt(blankBlock.style.top.replace("px", ""));
        let blankLeft = parseInt(blankBlock.style.left.replace("px", ""));

        let delta = this.props.blockSize + this.state.marginpix;

        let no = parseInt(e.target.innerHTML);

        //Move down
        if (blankTop - delta === top && blankLeft === left) {
            this.moveBlock(no, "down");
            this.moveBlock(this.state.blankBlockNo, "up");
        }

        //Move right
        else if (blankTop === top && blankLeft - delta === left) {
            this.moveBlock(no, "right");
            this.moveBlock(this.state.blankBlockNo, "left");
        }

        //Move up
        else if (blankTop + delta === top && blankLeft === left) {
            this.moveBlock(no, "up");
            this.moveBlock(this.state.blankBlockNo, "down");
        }

        //Move left
        else if (blankTop === top && blankLeft + delta === left) {
            this.moveBlock(no, "left");
            this.moveBlock(this.state.blankBlockNo, "right");
        }
    };

    moveBlock = (blockNo, move) => {
        let movepix = this.props.blockSize + this.state.marginpix;
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
        }));
    }

    shuffleSingleBlock = () => {
        let blankBlock = this.getBlankBlock();
        let bTop = parseInt(blankBlock.style.top.replace("px", ""));
        let bLeft = parseInt(blankBlock.style.left.replace("px", ""));

        
    };

    render = () => {
        return <div id="gameplot" className="game-plot" style={{ height: this.state.boxSize, width: this.state.boxSize }}>
            {
                this.state.gameMatrix.map((arr, i) => {
                    return <React.Fragment key={i}>
                        {
                            arr.map((block, j) => {
                                return <Block style={block.style} x={i} y={j} key={block.no} isBlank={block.isBlank} onClick={this.onBlockClick}>{block.no}</Block>
                            })
                        }
                    </ React.Fragment>
                })
            }
        </div >;
    };
}

export default GamePlot;