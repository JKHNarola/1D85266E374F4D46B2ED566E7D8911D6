import React from 'react';

class ShufflingLoader extends React.Component {
    componentDidMount = () => {
        setTimeout(() => {
            Array.from(document.getElementsByClassName("shuffle-loader"))[0].style.opacity = 1;
        }, 100);
    };

    render = () => {
        return (
            <div className="shuffle-loader" style={{ height: this.props.boxSize, width: this.props.boxSize }}>
                <span class="loader"><span class="loader-inner"></span></span>
            </ div>
        );
    }
}

export default ShufflingLoader;