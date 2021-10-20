import React from 'react';

export class Block extends React.Component {
    render = () => {
        return <div className={"block" + (this.props.isBlank ? " blank" : "")} style={this.props.style} onClick={(e) => this.props.onClick(e)}>{this.props.children}</div>;
    };
}

export default Block;