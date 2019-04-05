import { MESSAGES_RECEIVED, MESSAGES_LOADING, NEW_MESSAGE } from './constants';

export const createMessagesReceivedAction = (messages) => {
  return {
    type: MESSAGES_RECEIVED,
    messages: messages
  }
};

export const createLoadingAction = () => {
  return {
    type: MESSAGES_LOADING
  }
};

export const createNewMessageAction = (message) => {
  return {
    type: NEW_MESSAGE,
    message: message
  }
};
