import React from 'react';

export default class extends React.Component {
    constructor() {
        super()
        this.state = {
            recipient: this.state.recipient,
            subject: '',
            body: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange = (event) => {
        this.setState = {
            [event.target.name]: event.target.value
        }
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            recipient: '',
            subject: '',
            body: ''
        })
    }

    render() {

        return (
             <form onSubmit={this.handleSubmit}>
            {/* <form onSubmit={() => onSend(this.state)}> */}
                <div className="form-group">
                    <label>To:</label>
                    <input onChange={this.handleChange} type="text" id="recipient-field" name="recipient" value={this.state.recipient} />
                </div>
                <div className="form-group">
                    <label>Subject:</label>
                    <input onChange={this.handleChange} type="text" id="subject-field" name="subject"  value={this.state.subject} />
                </div>
                <div className="form-group">
                    <label>Body:</label>
                    <textarea id="body-field" name="body" value={this.state.body} />
                </div>
                <button type="submit">Send Message</button>
            </form>
        );
    }

}
