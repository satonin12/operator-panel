import { takeLatest, put, call, all } from 'redux-saga/effects'

import rsf from '../firebase'
import { toast } from 'react-toastify'

function* signIn(action) {
  try {
    yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.user.email,
      action.user.password
    )
    yield put({ type: 'CHECKOUT_SUCCESS', user: action.user }) // save user data in our form
    // yield put({ type: 'CHECKOUT_SUCCESS', user: data }) // save user data in firebase response

    yield put({ type: 'SET_AUTH', payload: true }) // save user data in our form

    toast.success('🦄 Вы успешно авторизовались!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  } catch (e) {
    const e_msg = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_FAILURE', error: e_msg })

    toast.error('🦄 С авторизацией возникли проблемы!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
}

function* signUp(action) {
  try {
    yield call(
      rsf.auth.createUserWithEmailAndPassword,
      action.user.email,
      action.user.password
    )

    yield put({ type: 'CHECKOUT_REGISTRATION_SUCCESS', user: action.user }) // save user data in our form
    yield put({ type: 'SET_AUTH', payload: true }) // save user data in our form

    toast.success('🦄 Вы успешно зарегистрировались', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  } catch (e) {
    const e_msg = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_REGISTRATION_FAILURE', error: e_msg })

    toast.error('🦄 С регистрацией возникли проблемы!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest('CHECKOUT_REQUEST', signIn),
    takeLatest('CHECKOUT_REGISTRATION_REQUEST', signUp),
  ])
}
