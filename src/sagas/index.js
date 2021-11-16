import { takeLatest, put, call, all } from 'redux-saga/effects'

import rsf from '../firebase'
import { toast } from 'react-toastify'

// * auth Saga's

function * signIn (action) {
  try {
    const data = yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.user.email,
      action.user.password
    )

    const token = data.user.refreshToken

    yield put({ type: 'SET_TOKEN', payload: token }) // save user token in our response
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
      progress: undefined
    })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_FAILURE', error: errorMessage })

    toast.error('🦄 С авторизацией возникли проблемы!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  }
}

function * signUp (action) {
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
      draggable: true
    })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_REGISTRATION_FAILURE', error: errorMessage })

    toast.error('🦄 С регистрацией возникли проблемы!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  }
}

function * forgotPassword (action) {
  try {
    console.log(action)
    yield call(rsf.auth.sendPasswordResetEmail, action.user.email)

    toast.success('🦄 Уведомление успешно отправлено, проверьте свой Email!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'FORGOT_PASSWORD_FAILURE', error: errorMessage })

    toast.error('🦄 С возобновлением пароля возникли проблемы!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    })
  }
}

// * dialogs Saga's

function * getDialogs () {
  try {
    const tmpDialogs = {
      active: [],
      complete: [],
      start: [],
      save: []
    }

    tmpDialogs.active = yield call(rsf.database.read, 'chat/active/')
    tmpDialogs.complete = yield call(rsf.database.read, 'chat/complete/')
    tmpDialogs.start = yield call(rsf.database.read, 'chat/start/')

    const length = {
      active: tmpDialogs.active.length,
      complete: tmpDialogs.complete.length,
      start: tmpDialogs.start.length,
      save: 0
    }

    Object.keys(tmpDialogs).filter(item => {
      return item !== null
    })

    yield put({ type: 'GET_DIALOGS_SUCCESS', payload: { dialogs: tmpDialogs, length } })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    yield put({ type: 'GET_DIALOGS_FAILURE', error: errorMessage })
  }
}

export default function * rootSaga () {
  yield all([
    takeLatest('CHECKOUT_REQUEST', signIn),
    takeLatest('CHECKOUT_REGISTRATION_REQUEST', signUp),
    takeLatest('FORGOT_PASSWORD_REQUEST', forgotPassword),

    takeLatest('GET_DIALOGS_REQUEST', getDialogs)
  ])
}
