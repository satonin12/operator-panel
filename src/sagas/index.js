import { takeLatest, put, call, all, select } from 'redux-saga/effects'

import rsf from '../firebase'
import { toast } from 'react-toastify'
import firebase from 'firebase'

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
      start: [],
      active: [],
      complete: [],
      save: []
    }

    tmpDialogs.start = yield call(rsf.database.read, 'chat/start/')
    tmpDialogs.active = yield call(rsf.database.read, 'chat/active/')
    tmpDialogs.complete = yield call(rsf.database.read, 'chat/complete/')

    Object.keys(tmpDialogs).filter(item => item !== null || typeof item !== 'undefined') // удаляем null иndefined значения
    const dialogsLength = Object.keys(tmpDialogs).map(a => tmpDialogs[a].reduce(function (total) { return total + 1 }, 0)) // и правильно считаем длину

    const length = {
      start: dialogsLength[0],
      active: dialogsLength[1],
      complete: dialogsLength[2],
      save: dialogsLength[3]
    }

    yield put({ type: 'GET_DIALOGS_SUCCESS', payload: { dialogs: tmpDialogs, length } })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    yield put({ type: 'GET_DIALOGS_FAILURE', error: errorMessage })
  }
}

// * message Saga's

export const getMessagesState = (state) => state.message
export const getDialogsState = (state) => state.dialog

function * getMessages (action) {
  try {
    const { status, uuid } = action.payload
    const tmpObject = yield call(
      rsf.database.read,
      firebase.database().ref(`chat/${status}`).orderByChild('uuid').equalTo(uuid))

    const keyArray = +Object.keys(tmpObject)
    const messages = tmpObject[keyArray].messages
    yield put({ type: 'GET_MESSAGES_SUCCESS', payload: { messages, index: keyArray, length: messages.length, id: uuid } })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
  }
}

function * sendMessage (action) {
  try {
    const { status, message } = action.payload
    const { messageLength, indexDialogUser, idDialogUser } = yield select(getMessagesState)
    const { filteredMessages } = yield select(getDialogsState)
    const chatMessageRef = firebase.database().ref(`chat/${status}/${indexDialogUser}/messages/${messageLength}`)
    yield call(() => {
      return new Promise((resolve, _) => {
        chatMessageRef.set(message)
        resolve(true)
      })
    })

    if (idDialogUser === filteredMessages[status][indexDialogUser].uuid) {
      yield put({ type: 'ADD_MESSAGE_TO_DIALOG', payload: { status, index: indexDialogUser, message, id: idDialogUser } })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
  }
}

export default function * rootSaga () {
  yield all([
    takeLatest('CHECKOUT_REQUEST', signIn),
    takeLatest('CHECKOUT_REGISTRATION_REQUEST', signUp),
    takeLatest('FORGOT_PASSWORD_REQUEST', forgotPassword),

    takeLatest('GET_DIALOGS_REQUEST', getDialogs),

    takeLatest('GET_MESSAGES_REQUEST', getMessages),
    takeLatest('SEND_MESSAGE', sendMessage)
  ])
}
