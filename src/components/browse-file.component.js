import React from 'react';
import MessageBox from './messagebox.component';
import 'react-image-crop/dist/ReactCrop.css';

export class BrowseImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgBase64: null,
            allowedExts: ['jpg', 'jpeg']
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

        if (this.state.allowedExts.indexOf(ext.toLowerCase()) < 0) {
            MessageBox.error("File not allowed", "Only .jpeg or .jpg image file is allowed.");
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 300 || img.height < 300) {
                    MessageBox.error("File size invalid", "Image size must be greater than or equal to 300 x 300 pixels.");
                    return;
                }

                this.setState({ imgBase64: reader.result });
                if (img.width !== img.height)
                    this.props.onImageSelected({ image: reader.result, isCropNeeded: true });
                else
                    this.props.onImageSelected({ image: reader.result, isCropNeeded: false });
            }
            img.src = reader.result;
        });
        reader.readAsDataURL(file);
    };

    onRemove = () => {
        this.setState({ imgBase64: null });
        this.props.onRemove();
    };

    render = () => {
        return <>
            {
                !this.state.imgBase64 &&
                <div className="browse-file" onClick={this.onBrowseClick}>
                    <input disabled={this.props.disabled} accept=".jpg, .jpeg" ref={this.inputRef} style={{ display: "none" }} className="form-control" type="file" onChange={this.onFileChange} />
                    <i className="zmdi zmdi-image-o" style={{ fontSize: '35px' }}></i>
                    <p>Click here to browse for an image.</p>
                </div>
            }
            {
                this.state.imgBase64 && <div className="remove-browse-file" onClick={this.onRemove}>
                    <i className="zmdi zmdi-close"></i>
                </div>
            }
        </>;
    };
}

export default BrowseImage;