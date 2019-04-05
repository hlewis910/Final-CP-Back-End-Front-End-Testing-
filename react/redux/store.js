import { createStore } from 'redux';
import rootReducer from './reducer';

// const initialState = {
//   messagesLoading: false,
//   messages: []
// };


export default createStore(rootReducer);
