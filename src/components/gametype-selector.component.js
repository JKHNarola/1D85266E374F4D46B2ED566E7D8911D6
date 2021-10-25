import React from 'react';
import ImageSelector from './image-selector';

export class GameTypeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.default
        }
    }

    onChange = (e) => {
        this.setState({ value: e.target.value });
        if (this.props.onChange) this.props.onChange(e.target.value);
    };

    render = () => {
        const types = <div className="row">
            <div className="col-sm-12">
                <div className="custom-radio">
                    <label className="container">Number
                        <input type="radio" name="gametyperadio" checked={this.props.default === "number"} value="number" onChange={this.onChange.bind(this)} />
                        <span className="checkmark"></span>
                    </label>
                </div>
                <div className="custom-radio">
                    <label className="container">Image
                        <input type="radio" name="gametyperadio" checked={this.props.default === "image"} value="image" onChange={this.onChange.bind(this)} />
                        <span className="checkmark"></span>
                    </label>
                </div>
            </div>
        </div>;

        const imageSelector = this.state.value === "image" && <ImageSelector onSelectImage={this.props.onImageSelect} />;

        return <div className="game-types-selector">
            {types}
            {imageSelector}
        </div>;
    };
}

export default GameTypeSelector;