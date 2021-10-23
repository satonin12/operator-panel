export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE'

export function checkout() {
  return {
    type: CHECKOUT_REQUEST,
  }
}

export function checkoutSuccess(credential) {
  return {
    type: CHECKOUT_SUCCESS,
    credential,
  }
}

export function checkoutFailure(error) {
  return {
    type: CHECKOUT_FAILURE,
    error,
  }
}
