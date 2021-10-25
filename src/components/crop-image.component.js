import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export class CropImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: this.props.image,
            crop: {
                unit: 'px',
                width: 300,
                height: 300,
                aspect: 1 / 1,
            }
        }
    }

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropChange = crop => {
        this.setState({ crop });
    };

    onCropComplete = (crop) => {
        if (this.imageRef && crop.width && crop.height)
            this.getCroppedImg(this.imageRef, crop);
    };

    getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas');
        const pixelRatio = window.devicePixelRatio;
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        canvas.width = crop.width * pixelRatio * scaleX;
        canvas.height = crop.height * pixelRatio * scaleY;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Canvas is empty'));
                        return;
                    }
                    window.URL.revokeObjectURL(this.fileUrl);
                    this.fileUrl = window.URL.createObjectURL(blob);
                    resolve(this.fileUrl);
                },
                'image/jpeg',
                1
            );
        });
    }

    onOK = () => {
        if (this.fileUrl) this.props.onImageCropped(this.fileUrl);
    };

    render = () => {
        return <div className="crop-image-area">
            <ReactCrop
                src={this.state.imgSrc}
                crop={this.state.crop}
                onChange={this.onCropChange}
                onComplete={this.onCropComplete}
                onImageLoaded={this.onImageLoaded} />
            <div className="row mt-3">
                <div className="col-sm-12 text-center">
                    <button type="button" className="btn btn-primary" onClick={this.onOK}>Ok</button>
                </div>
            </div>
        </ div>;
    };
}

export default CropImage;