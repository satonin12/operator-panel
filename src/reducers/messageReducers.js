import {
  GET_MESSAGES_FAILURE,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS, RESET_MESSAGE_STORE,
  SEND_MESSAGE, SEND_MESSAGE_FAILURE, SEND_MESSAGE_SUCCESS
} from '../actions/messageAction'

const initialState = {
  loading: false,
  messages: [],
  error: null,
  indexDialogUser: null,
  idDialogUser: null,
  messageLength: null
}

export function messageReducer (state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES_REQUEST:
      return {
        ...state,
        loading: true
      }
    case GET_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        idDialogUser: action.payload.id,
        messages: action.payload.messages,
        messageLength: action.payload.length,
        indexDialogUser: action.payload.index
      }
    case GET_MESSAGES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    case SEND_MESSAGE:
      return state
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messageLength: state.messageLength + 1
      }
    case SEND_MESSAGE_FAILURE:
      return {
        error: action.payload.error
      }
    case RESET_MESSAGE_STORE:
      return initialState
    default: return state
  }
}
