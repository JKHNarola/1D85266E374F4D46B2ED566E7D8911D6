import React from 'react';
import * as moment from 'moment'

export class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0,
            isStarted: false
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.isStart !== this.props.isStart) this.toggleTimer();
    };

    toggleTimer = () => {
        if (this.state.isStarted) this.stopTimer();
        else this.startTimer();
    }

    startTimer = () => {
        this.timer = setInterval(() => {
            this.setState(prev => ({ seconds: prev.seconds + 1, isStarted: true }));
        }, 1000);
    };

    stopTimer = () => {
        if (this.timer) clearInterval(this.timer);
        this.setState(prevState => ({ isStarted: !prevState.isStarted }));
    };

    render = () => {
        return <div className="row timer">
            <div className="col-sm-12 text-center">{moment.utc(this.state.seconds * 1000).format('HH:mm:ss')}</div>
        </ div>
    };
}

export default Timer;