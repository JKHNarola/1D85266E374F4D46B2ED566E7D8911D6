import React from 'react';
import MessageBox from './messagebox.component';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export class BrowseAndCropImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgSrc: null,
            crop: {
                unit: 'px',
                width: 300,
                height: 300,
                aspect: 1 / 1,
            }
        }
        this.inputRef = React.createRef();
    }

    onBrowseClick = () => {
        this.inputRef.current.click();
    };

    onFileChange = event => {
        this.onFileSelected(event.target.files);
    };

    onFileSelected = (f) => {
        let file = Array.from(f)[0];
        const name = file.name;
        const lastDot = name.lastIndexOf('.');
        const ext = name.substring(lastDot + 1);

        if (['jpg', 'jpeg'].indexOf(ext.toLowerCase()) < 0) {
            MessageBox.error("File not allowed", "Only .jpeg or .jpg file is allowed.");
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => this.setState({ imgSrc: reader.result }));
        reader.readAsDataURL(file);
    };

    onImageLoaded = (image) => {
        this.imageRef = image;
    };

    onCropChange = crop => {
        this.setState({ crop });
    };

    onCropComplete = (crop) => {
        if (this.imageRef && crop.width && crop.height)
            this.imageBase64 = this.getCroppedImg(this.imageRef, crop);
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
        if (this.fileUrl) this.props.onImageSelected(this.fileUrl);
    };

    onCancel = () => {
        this.setState({ imgSrc: null });
        if (this.fileUrl) window.URL.createObjectURL(this.fileUrl);
    };

    render = () => {
        return <>
            {
                !this.state.imgSrc &&
                <div className="browse-file" onClick={this.onBrowseClick}>
                    <input disabled={this.props.disabled} accept=".jpg, .jpeg" ref={this.inputRef} style={{ display: "none" }} className="form-control" type="file" onChange={this.onFileChange} />
                    <i className="zmdi zmdi-image-o" style={{ fontSize: '35px' }}></i>
                    <p>Click here to browse for an image.</p>
                </div>
            }
            {
                this.state.imgSrc &&
                <ReactCrop
                    src={this.state.imgSrc}
                    crop={this.state.crop}
                    onChange={this.onCropChange}
                    onComplete={this.onCropComplete}
                    onImageLoaded={this.onImageLoaded} />
            }
            {
                this.state.imgSrc &&
                <div className="row">
                    <div className="col-sm-12">
                        <button type="button" className="btn btn-danger btn-sm" onClick={this.onCancel}>Cancel</button>&nbsp;
                        <button type="button" className="btn btn-primary btn-sm" onClick={this.onOK}>Ok</button>
                    </div>
                </div>
            }
        </>;
    };
}

export default BrowseAndCropImage;