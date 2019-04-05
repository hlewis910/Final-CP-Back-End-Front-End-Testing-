import {
    MESSAGES_RECEIVED,
    MESSAGES_LOADING,
    NEW_MESSAGE
} from './constants';

const initialState = {
    messagesLoading: false,
    messages: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case MESSAGES_LOADING:
            return {
                ...state,
                messagesLoading: true,
                messages: []
            }

        case MESSAGES_RECEIVED:
            return {
                ...state,
                messages: action.messages
            }

        case NEW_MESSAGE:
            return {
                ...state,
                messages: [...state.messages, action.message]
            }
        default:
            return state;
    }

};
