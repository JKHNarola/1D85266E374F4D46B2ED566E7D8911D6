import React from 'react';

export class BrowseFile extends React.Component {
    render = () => {
        return <div className="browse-file">
            <i className="zmdi zmdi-image-o" style={{ fontSize: '35px' }}></i>
            <p>Click here to browse for an image.</p>
        </div>;
    };
}

export default BrowseFile;