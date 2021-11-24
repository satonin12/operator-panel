import {
  CHECKOUT_FAILURE,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
} from '../actions'

const initialState = {
  fetching: false,
  user: null,
  error: null,
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case CHECKOUT_REQUEST:
      return { ...state, fetching: true, error: null }
    case CHECKOUT_SUCCESS:
      return { ...state, fetching: true, user: action.user, error: null }
    case CHECKOUT_FAILURE:
      return { ...state, fetching: false, user: null, error: action.error }
    default:
      return state
  }
}
