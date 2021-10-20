import React from 'react';
import Block from './block.component';

export class GamePlot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            boxSize: (this.props.blockSize + (this.props.blockMargin * 2)) * this.props.matrixSize + "px",
            blockStyle: {
                height: this.props.blockSize + "px",
                width: this.props.blockSize + "px",
                margin: this.props.blockMargin + "px",
                lineHeight: this.props.blockSize + "px"
            },
            animatespeed: 50,
            shuffleAnimateSpeed: 50,
            noMatrix: [],
            marginpix: this.props.blockMargin * 2,
            shuffleMoves: this.props.matrixSize * 100
        };

        this.gameplotref = React.createRef();
    }

    componentDidMount = () => {
        let noMatrix = [];
        for (let y = 1; y <= this.props.matrixSize; y++) {
            let arr = [];
            for (let x = 1; x <= this.props.matrixSize; x++) {
                let no = x + ((this.props.matrixSize * y) - this.props.matrixSize);
                arr.push({
                    no: no,
                    left: (x - 1) * (this.props.blockSize + this.state.marginpix),
                    top: (y - 1) * (this.props.blockSize + this.state.marginpix)
                });
            }
            noMatrix.push(arr);
        }
        this.setState({ noMatrix: noMatrix });

        setTimeout(() => {
            let left = 0;
            let index = 1;
            let colCtr = 1;
            let rowPos = [];
            let colPos = [];

            [...this.gameplotref.current.children].forEach((obj, i) => {
                let row = 0;
                if (index % this.props.matrixSize === 0) row = index / this.props.matrixSize;
                else row = parseInt(index / this.props.matrixSize) + 1;

                rowPos.push((this.props.blockSize + this.state.marginpix) * (row - 1));
                colPos.push(left);
                window.$(obj).animate({
                    left: "+=" + left + "px",
                    top: "+=" + (this.props.blockSize + this.state.marginpix) * (row - 1) + "px",
                    opacity: 1
                }, 250);

                if (colCtr === this.props.matrixSize) {
                    left = 0;
                    colCtr = 1;
                }
                else {
                    left = left + this.props.blockSize + this.state.marginpix;
                    colCtr++;
                }

                index++;

                rowPos = rowPos.filter(function (item, pos) { return rowPos.indexOf(item) === pos; });
                colPos = colPos.filter(function (item, pos) { return colPos.indexOf(item) === pos; });
            });

            this.setState({ rowPos: rowPos, colPos: colPos });

            setTimeout(() => {
                for (var g = 0; g < this.state.shuffleMoves; g++) this.shuffle();
            }, 1000);

        }, 50);
    };

    onBlockClick = (e) => {
        let currtoppos = this.state.rowPos.indexOf(parseInt(e.target.style.top.replace("px", ""))) + 1;
        let currleftpos = this.state.colPos.indexOf(parseInt(e.target.style.left.replace("px", ""))) + 1;
        let currBlockNo = ((currtoppos - 1) * this.props.matrixSize) + currleftpos;

        let blanktoppos = this.state.rowPos.indexOf(parseInt(window.$(".block.blank").css('top'))) + 1;
        let blankleftpos = this.state.rowPos.indexOf(parseInt(window.$(".block.blank").css('left'))) + 1;
        let blankBlockNo = ((blanktoppos - 1) * this.props.matrixSize) + blankleftpos;

        if (currBlockNo === blankBlockNo) return;

        let leftNo = currBlockNo - 1;
        let rightNo = currBlockNo + 1;
        let topNo = currBlockNo - this.props.matrixSize;
        let bottomNo = currBlockNo + this.props.matrixSize;
        let self = this;
        if (blankBlockNo === leftNo) {
            window.$(e.target).animate({
                left: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, this.state.animatespeed);
            window.$(".block.blank").animate({
                left: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, 0);
        }
        else if (blankBlockNo === rightNo) {
            window.$(e.target).animate({
                left: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, this.state.animatespeed);
            window.$(".block.blank").animate({
                left: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, 0);
        }
        else if (blankBlockNo === topNo) {
            window.$(e.target).animate({
                top: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, this.state.animatespeed);
            window.$(".block.blank").animate({
                top: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, 0);
        }
        else if (blankBlockNo === bottomNo) {
            window.$(e.target).animate({
                top: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, this.state.animatespeed);
            window.$(".block.blank").animate({
                top: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            }, 0);
        }
    };

    shuffle = () => {
        let blanktoppos = this.state.rowPos.indexOf(parseInt(window.$(".block.blank").css('top'))) + 1;
        let blankleftpos = this.state.rowPos.indexOf(parseInt(window.$(".block.blank").css('left'))) + 1;
        let blankBlockNo = ((blanktoppos - 1) * this.props.matrixSize) + blankleftpos;


        let surroundingBlocks = this.getSurroundingElements(blankBlockNo).filter(x => x !== null);

        let random = surroundingBlocks[Math.floor(Math.random() * surroundingBlocks.length)];

        let blockToMove = [...this.gameplotref.current.children].filter(blockdiv => parseInt(blockdiv.style.top.replace("px", "")) === random.top && parseInt(blockdiv.style.left.replace("px", "")) === random.left)[0];

        // console.log("blank block no", blankBlockNo);
        // console.log("surrounding blocks", surroundingBlocks);
        // console.log("random", random);
        // console.log("random", blockToMove);
        // console.log("===================================");
        let self = this;
        if (random.pos === "l") {
            window.$(blockToMove).css({
                left: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
            window.$(".block.blank").css({
                left: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
        }
        else if (random.pos === "r") {
            window.$(blockToMove).css({
                left: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
            window.$(".block.blank").css({
                left: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
        }
        else if (random.pos === "t") {
            window.$(blockToMove).css({
                top: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
            window.$(".block.blank").css({
                top: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
        }
        else if (random.pos === "b") {
            window.$(blockToMove).css({
                top: "-=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
            window.$(".block.blank").css({
                top: "+=" + (self.props.blockSize + self.state.marginpix) + "px",
            });
        }
    };

    getSurroundingElements = (no) => {
        let x = null;
        let y = null;
        for (let xx = 0; xx < this.state.noMatrix.length; xx++) {
            for (let yy = 0; yy < this.state.noMatrix.length; yy++) {
                if (this.state.noMatrix[xx][yy].no === no) {
                    x = xx;
                    y = yy;
                    break;
                }
            }
        }

        let x_limit = this.state.noMatrix.length;
        let y_limit = this.state.noMatrix[0].length;
        let t = ((x - 1 >= 0) ? this.state.noMatrix[x - 1][y] : null);
        let l = ((y - 1 >= 0) ? this.state.noMatrix[x][y - 1] : null);
        let b = ((x + 1 < x_limit) ? this.state.noMatrix[x + 1][y] : null);
        let r = ((y + 1 < y_limit) ? this.state.noMatrix[x][y + 1] : null);
        if (t) t.pos = "t";
        if (l) l.pos = "l";
        if (r) r.pos = "r";
        if (b) b.pos = "b";
        return [t, l, r, b];
    }

    render = () => {
        return <div id="gameplot" className="game-plot" ref={this.gameplotref} style={{ height: this.state.boxSize, width: this.state.boxSize }}>
            {
                [...Array(this.props.matrixSize * this.props.matrixSize)].map((e, i) => {
                    const lastIndex = (this.props.matrixSize * this.props.matrixSize) - 1;
                    const no = i === lastIndex ? "" : i + 1;
                    return <Block style={this.state.blockStyle} key={i} isBlank={i === lastIndex} onClick={this.onBlockClick}>{no}</Block>
                })
            }
        </div>;
    };
}

export default GamePlot;