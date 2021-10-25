import React from 'react';

export class Moves extends React.Component {
    render = () =>
        <div className="row moves">
            <div className="col-sm-12 text-center">
                Moves: <b>{this.props.count}</b>
            </div>
        </div>;
}

export default Moves;