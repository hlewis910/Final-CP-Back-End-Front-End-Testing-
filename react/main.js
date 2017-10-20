import React from 'react';
import ReactDOM from 'react-dom';
import Inbox from './components/Inbox';
import NewMessageForm from './components/NewMessageForm';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

/* For you to be able to visualize everything, you will need to give similar data to each component that each test gives to the component */

ReactDOM.render(
	<Router>
  	<div>
  		<Link to="/inbox">
  			<button>Inbox</button>
  		</Link>
  		<Link to="/newMessage">
  			<button>New Message</button>
  		</Link>
  	</div>
  	<Route path="/inbox" component={Inbox} />
  	<Route path="/newMessage" component={NewMessageForm} />
  </Router>,
  document.getElementById('app')
);