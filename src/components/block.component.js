import React from 'react';

export class Block extends React.Component {
    render = () => {
        return <div className={"block" + (this.props.isBlank ? " blank" : "")} data-isblank={this.props.isBlank} data-row-index={this.props.x} data-col-index={this.props.y} style={this.props.style} onClick={(e) => this.props.onClick(e)}>{this.props.children}</div>;
    };
}

export default Block;