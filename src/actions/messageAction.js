export const GET_MESSAGES_REQUEST = 'GET_MESSAGES_REQUEST'
export const GET_MESSAGES_SUCCESS = 'GET_MESSAGES_SUCCESS'
export const GET_MESSAGES_FAILURE = 'GET_MESSAGES_FAILURE'

export const SEND_MESSAGE = 'SEND_MESSAGE'
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE'
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE'

export const RESET_MESSAGE_STORE = 'RESET_MESSAGE_STORE'

// =======================================

export function getMessagesRequest ({ status, uuid }) {
  return {
    type: GET_MESSAGES_REQUEST,
    status,
    uuid
  }
}

export function getMessagesSuccess (messages) {
  return {
    type: GET_MESSAGES_SUCCESS,
    messages
  }
}

export function getMessagesError (error) {
  return {
    type: GET_MESSAGES_FAILURE,
    error
  }
}

// =======================================

export function sendMessageRequest ({ status, message }) {
  return {
    type: SEND_MESSAGE,
    status,
    message
  }
}

export function sendMessageSuccess () {
  return {
    type: SEND_MESSAGE_SUCCESS
  }
}

export function sendMessageError (error) {
  return {
    type: SEND_MESSAGE_FAILURE,
    error
  }
}

export function resetMessage () {
  return {
    type: RESET_MESSAGE_STORE
  }
}
