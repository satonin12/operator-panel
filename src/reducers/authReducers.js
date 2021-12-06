import {
  CHANGE_USER_FIELD,
  CHECKOUT_FAILURE,
  CHECKOUT_REGISTRATION_REQUEST,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS, REFRESH_PASSWORD, REFRESH_PASSWORD_ERROR, RESET_STORE,
  SET_AUTH, SET_TOKEN
} from '../actions/authAction'

const initialState = {
  fetching: false,
  error: null,
  user: null,
  isAuth: false,
  token: null
}

export function authReducer (state = initialState, action) {
  switch (action.type) {
    case CHECKOUT_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        fetching: false,
        user: action.user
      }
    case CHECKOUT_FAILURE:
      return {
        ...state,
        fetching: false,
        error: action.error
      }
    case CHECKOUT_REGISTRATION_REQUEST:
      return {
        ...state,
        user: action
      }
    case SET_AUTH:
      return {
        ...state,
        isAuth: action.payload
      }
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case RESET_STORE:
      return initialState
    case REFRESH_PASSWORD:
      return state
    case REFRESH_PASSWORD_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case CHANGE_USER_FIELD:
      // eslint-disable-next-line no-case-declarations
      const keyUser = Object.keys(action.payload)[0]
      return {
        ...state,
        user: {
          ...state.user,
          [keyUser]: action.payload[keyUser]
        }
      }
    default:
      return state
  }
}
