import React from 'react';
import BrowseImage from './browse-file.component';
import CropImage from './crop-image.component';

export class ImageSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            noOfSamples: 9,
            isCrop: false,
            imageForCrop: null,
            customImage: null
        }
    }

    onSelect = (e) => {
        this.setState({ selected: e });
        if (this.props.onSelectImage) this.props.onSelectImage('url("sample-images/' + e + '.jpg")');
    };

    onCustomImageSelected = (e) => {
        this.setState({ selected: 'custom' });
        if (e.isCropNeeded)
            this.setState({ isCrop: true, imageForCrop: e.image });
        else
            this.convertBase64toFileUrl(e.image).then(fileUrl => {
                this.setState({ customImage: fileUrl });
                if (this.props.onSelectImage) this.props.onSelectImage('url("' + fileUrl + '")');
            });
    };

    convertBase64toFileUrl = base64 => {
        return new Promise((resolve, reject) => {
            fetch(base64).then(response => {
                resolve(window.URL.createObjectURL(response.blob()))
            });
        });
    };

    onImageCropped = (fileUrl) => {
        this.setState({ isCrop: false, customImage: fileUrl });
        if (this.props.onSelectImage) this.props.onSelectImage('url("' + fileUrl + '")');
    };

    onCustomImageBlockClick = () => {
        if (this.state.customImage) {
            this.setState({ selected: 'custom' });
            if (this.props.onSelectImage) this.props.onSelectImage(this.state.customImage);
        }
    };

    onRemoveCustomeImage = () => {
        if (this.state.customImage) window.URL.revokeObjectURL(this.state.customImage);
        setTimeout(() => {
            this.setState({
                customImage: null,
                isCrop: false,
                selected: null,
                imageForCrop: null
            });
        }, 20);
    };

    render = () => {
        return <>
            <div className="default-image-selector">
                {
                    [...Array(this.state.noOfSamples).keys()].map(x =>
                        <div key={x + 1} onClick={() => this.onSelect(x + 1)} className={"image" + (this.state.selected === x + 1 ? " active" : "")}>
                            <img src={"sample-images/" + (x + 1) + ".jpg"} alt="" />
                        </div>
                    )
                }
                <div onClick={this.onCustomImageBlockClick} className={"image" + (this.state.selected === "custom" ? " active" : "")}>
                    <BrowseImage onImageSelected={this.onCustomImageSelected} onRemove={this.onRemoveCustomeImage} />
                    {this.state.customImage && <img src={this.state.customImage} alt="" />}
                </div>
            </div>
            {
                this.state.isCrop && <CropImage image={this.state.imageForCrop} onImageCropped={this.onImageCropped} />
            }
        </>
    }
};

export default ImageSelector;