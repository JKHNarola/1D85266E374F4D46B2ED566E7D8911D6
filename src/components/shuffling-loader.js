import React from 'react';

class ShufflingLoader extends React.Component {
    render = () => {
        return (
            <div className="shuffle-loader" style={{ height: this.props.boxSize, width: this.props.boxSize }}>
            </ div>
        );
    }
}

export default ShufflingLoader;