import {
  CHECKOUT_FAILURE,
  CHECKOUT_REGISTRATION_REQUEST,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  SET_AUTH
} from '../actions'

const initialState = {
  fetching: false,
  error: null,
  user: null,
  createUser: null,
  isAuth: false
}

export function reducer (state = initialState, action) {
  switch (action.type) {
    case CHECKOUT_REQUEST:
      return { ...state, fetching: true, createUser: null, error: null }
    case CHECKOUT_SUCCESS:
      return {
        ...state,
        fetching: true,
        createUser: null,
        user: action.user,
        error: null
      }
    case CHECKOUT_FAILURE:
      return {
        ...state,
        fetching: false,
        createUser: null,
        user: null,
        error: action.error
      }
    case CHECKOUT_REGISTRATION_REQUEST:
      return {
        ...state,
        fetching: false,
        createUser: action,
        user: action,
        error: null
      }
    case SET_AUTH:
      return {
        ...state,
        isAuth: action.payload
      }
    default:
      return state
  }
}
