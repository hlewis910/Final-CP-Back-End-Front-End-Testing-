import React from 'react';
import Message from './Message';
import store from '../redux/store';

export default class extends React.Component {

    constructor() {
        super();
        this.state = {
            messages: []
        }
    }

    render() {
        const {messages} = this.state
        return (
            <div>
                <h1>Inbox</h1>
                {messages.map(message => {
                    return (
                 < Message fullMessage={message} />
                    )
                })}
            </div>
        );
    }
}
