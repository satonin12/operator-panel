export const CHECKOUT_REQUEST = 'CHECKOUT_REQUEST'
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS'
export const CHECKOUT_FAILURE = 'CHECKOUT_FAILURE'

// =======================================

export const CHECKOUT_REGISTRATION_REQUEST = 'CHECKOUT_REGISTRATION_REQUEST'
export const CHECKOUT_REGISTRATION_SUCCESS = 'CHECKOUT_REGISTRATION_SUCCESS'
export const CHECKOUT_REGISTRATION_FAILURE = 'CHECKOUT_REGISTRATION_FAILURE'

// ========================================

export const SET_AUTH = 'SET_AUTH'

// ========================================

export const SET_TOKEN = 'SET_TOKEN'

// ========================================

export const RESET_STORE = 'RESET_STORE'

// ========================================

export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST'
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS'
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE'

// ========================================

export function checkout () {
  return {
    type: CHECKOUT_REQUEST
  }
}

export function checkoutSuccess (credential) {
  return {
    type: CHECKOUT_SUCCESS,
    credential
  }
}

export function checkoutFailure (error) {
  return {
    type: CHECKOUT_FAILURE,
    error
  }
}

// ========================================

export function checkoutRegistration () {
  return {
    type: CHECKOUT_REGISTRATION_REQUEST
  }
}

export function checkoutRegistrationSuccess (credential) {
  return {
    type: CHECKOUT_REGISTRATION_SUCCESS,
    credential
  }
}

export function checkoutRegistrationFailure (error) {
  return {
    type: CHECKOUT_REGISTRATION_FAILURE,
    error
  }
}

// ========================================

export function setAuth (auth) {
  return {
    type: SET_AUTH,
    auth
  }
}

// ========================================

export function setToken (token) {
  return {
    type: SET_TOKEN,
    token
  }
}

// ========================================

export function resetStore () {
  return {
    type: RESET_STORE
  }
}

// ========================================

export function forgotPassword () {
  return {
    type: FORGOT_PASSWORD_REQUEST
  }
}

export function forgotPasswordSuccess (credential) {
  return {
    type: FORGOT_PASSWORD_SUCCESS,
    credential
  }
}

export function forgotPasswordFailure (error) {
  return {
    type: FORGOT_PASSWORD_FAILURE,
    error
  }
}

// ========================================
