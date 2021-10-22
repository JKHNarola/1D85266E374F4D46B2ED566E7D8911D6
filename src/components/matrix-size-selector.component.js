import React from 'react';

export class MatrixSizeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sizes: [4, 5, 6, 7, 8],
            activeSize: this.props.default
        };
    }

    onButtonClick = (x) => {
        this.setState({ activeSize: x });
        if (this.props.onChange) this.props.onChange(x);
    }

    render = () => {
        return <div className="row">
            <div className="col-sm-12">
                {
                    this.state.sizes.map(x =>
                        <div key={x} onClick={() => this.onButtonClick(x)} className={"matrix-size" + (this.state.activeSize === x ? " active" : "")}>{x} X {x}</div>
                    )
                }
            </div>
        </div>;
    };
}

export default MatrixSizeSelector;