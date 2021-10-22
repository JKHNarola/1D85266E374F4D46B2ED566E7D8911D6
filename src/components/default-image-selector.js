import React from 'react';

export class DefaultImageSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        }
    }

    onSelect = (e) => {
        this.setState({ selected: e });
        if (this.props.onSelectImage) this.props.onSelectImage('url("sample-images/' + e + '.jpg")');
    };

    render = () => {
        return <div className="default-image-selector">
            <div onClick={() => { this.onSelect(1) }} className={"image" + (this.state.selected === 1 ? " active" : "")}>
                <img src="sample-images/1.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(2) }} className={"image" + (this.state.selected === 2 ? " active" : "")}>
                <img src="sample-images/2.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(3) }} className={"image" + (this.state.selected === 3 ? " active" : "")}>
                <img src="sample-images/3.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(1) }} className={"image" + (this.state.selected === 1 ? " active" : "")}>
                <img src="sample-images/1.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(2) }} className={"image" + (this.state.selected === 2 ? " active" : "")}>
                <img src="sample-images/2.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(3) }} className={"image" + (this.state.selected === 3 ? " active" : "")}>
                <img src="sample-images/3.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(1) }} className={"image" + (this.state.selected === 1 ? " active" : "")}>
                <img src="sample-images/1.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(2) }} className={"image" + (this.state.selected === 2 ? " active" : "")}>
                <img src="sample-images/2.jpg" alt="" />
            </div>
            <div onClick={() => { this.onSelect(3) }} className={"image" + (this.state.selected === 3 ? " active" : "")}>
                <img src="sample-images/3.jpg" alt="" />
            </div>
        </div>;
    };
}

export default DefaultImageSelector;