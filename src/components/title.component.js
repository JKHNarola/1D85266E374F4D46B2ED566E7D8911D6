import React from 'react';

export class Title extends React.Component {
    render = () => {
        return <div className="row">
            <div className="col-sm-12 title">
                <h5>Application Title</h5>
            </div>
        </div>;
    };
}

export default Title;