import React from 'react';

export default class extends React.Component {

    constructor() {
        super();
        this.state = {
            recipient: '',
            subject: '',
            body: ''
        };
        this.updateRecipient = this.updateRecipient.bind(this);
        this.updateSubject = this.updateSubject.bind(this);
        this.updateBody = this.updateBody.bind(this);
    }

    updateRecipient(e) {
        this.setState({ recipient: e.target.value });
    }

    updateSubject(e) {
        this.setState({ subject: e.target.value });
    }

    updateBody(e) {
        this.setState({ body: e.target.value });
    }

    render() {
        return (
            <form>
                <div className="form-group">
                    <label>To:</label>
                    <input type="text" id="recipient-field" />
                </div>
                <div className="form-group">
                    <label>Subject:</label>
                    <input type="text" id="subject-field" />
                </div>
                <div className="form-group">
                    <label>Body:</label>
                    <textarea id="body-field" />
                </div>
                <button type="submit">Send Message</button>
            </form>
        );
    }

}