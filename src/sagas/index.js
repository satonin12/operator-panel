import { takeLatest, put, call, all, select } from 'redux-saga/effects'

import rsf from '../firebase'
import { toast } from 'react-toastify'
import firebase from 'firebase'
import { AvatarGenerator } from 'random-avatar-generator'
import { AssignNewOperatorToDefaultOperatorSchema } from '../utils/operatorSchema'

// get state's

export const getAuthState = (state) => state.auth
export const getMessagesState = (state) => state.message
export const getDialogsState = (state) => state.dialog

// * auth Saga's

function * signIn (action) {
  try {
    const data = yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.user.email,
      action.user.password
    )

    const token = data.user.refreshToken
    const uid = data.user.uid

    // получаем пользователя из firebase
    const operatorRef = firebase.database().ref('operators/')

    const operatorFromFirebase = yield call(
      rsf.database.read,
      operatorRef.orderByChild('uid').equalTo(uid))

    const keysResponseOperator = Object.keys(operatorFromFirebase)
    const userToState = operatorFromFirebase[keysResponseOperator[0]]

    yield put({ type: 'SET_TOKEN', payload: token }) // save user token in our response
    yield put({ type: 'CHECKOUT_SUCCESS', user: userToState }) // save user data in our form
    yield put({ type: 'SET_AUTH', payload: true }) // save user data in our form

    // yield put({ type: 'CHECKOUT_SUCCESS', user: data }) // save user data in firebase response

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

function addOperatorFirebase (ref, obj) {
  return new Promise((resolve, reject) => {
    const newOperatorRef = ref.push()
    // key save in user as key on firebase get this user
    obj.keyFirebase = newOperatorRef.key
    const tmp = newOperatorRef.set(obj)

    if (tmp) {
      resolve(true)
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(false)
    }
  })
}

/*
  ? NOTICE:
  ? There is no need to check that such an operator already exists (for entered email),
  ? because this is included in the check for *rsf.auth.createUserWithEmailAndPassword* => then,
  ? when saving data, the operator in firebase will pop up try...catch
*/
function * signUp (action) {
  try {
    const data = yield call(
      rsf.auth.createUserWithEmailAndPassword,
      action.user.email,
      action.user.password
    )

    const uid = data.user.uid

    yield put({ type: 'CHECKOUT_REGISTRATION_SUCCESS', user: action.user }) // save user data in our form
    yield put({ type: 'SET_AUTH', payload: true }) // save user data in our form

    if (uid) {
      const newOperatorRef = firebase.database().ref('operators/')

      // создаем пользователя в firebase
      const generator = new AvatarGenerator()
      const urlRandomAvatar = generator.generateRandomAvatar()

      const newOperator = { uid, email: action.user.email, avatar: urlRandomAvatar }
      const newOperatorStandard = AssignNewOperatorToDefaultOperatorSchema(newOperator)
      yield call(addOperatorFirebase, newOperatorRef, newOperatorStandard)
    }

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

function reAuth (user, currentUser) {
  const credentials = firebase.auth.EmailAuthProvider.credential(user.email, user.password)
  return currentUser.reauthenticateWithCredential(credentials)
    .then((response) => ({ response }))
    .catch(error => ({ error }))
}

function updatePass (currentUser, action) {
  return new Promise((resolve, reject) => {
    const tmp = currentUser.updatePassword(action.payload.user.password)
    if (tmp) {
      resolve(true)
    } else {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject('Ошибка')
    }
  })
}

function * refreshPassword (action) {
  try {
    const currentUser = firebase.auth().currentUser
    const { user } = yield select(getAuthState)
    // compare oldPassword in enterPassword with that lies in redux state
    if (action.payload.user.oldPassword === user.password) {
      // eslint-disable-next-line no-unused-vars
      const { response, error } = yield call(reAuth, user, currentUser)

      if (response) {
        yield call(updatePass, currentUser, action)
        toast.success('🦄 Пароль успешно обновлен! Зайдите заново с новым паролем', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        })
        yield put({ type: 'RESET_STORE' })
        yield put({ type: 'RESET_DIALOGS_STORE' })
        yield put({ type: 'RESET_MESSAGE_STORE' })
      }
    } else {
      console.log('Старый пароль не совпадает, пожалуйста, проверьте правильность данных')
      yield put({ type: 'REFRESH_PASSWORD_ERROR', payload: 'Старый пароль не совпадает, пожалуйста, проверьте правильность данных' })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    // yield put({ type: 'CHECKOUT_FAILURE', error: errorMessage })
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
    const dialogId = filteredMessages[status][indexDialogUser].uuid
    const chatMessageRef = firebase.database().ref(`chat/${status}/${indexDialogUser}/messages/${messageLength}`)

    yield call(() => {
      return new Promise((resolve, _) => {
        chatMessageRef.set(message)
        resolve(true)
      })
    })

    if (idDialogUser === dialogId) {
      yield put({ type: 'ADD_MESSAGE_TO_DIALOG', payload: { status, index: indexDialogUser, message, id: idDialogUser } })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
  }
}

// * User Saga's

function * changeUser () {
  try {
    const { user } = yield select(getAuthState)
    yield call(rsf.database.update, `operators/${user.keyFirebase}`, user)
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    console.log(errorMessage)
    // yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
  }
}

export default function * rootSaga () {
  yield all([
    takeLatest('CHECKOUT_REQUEST', signIn),
    takeLatest('CHECKOUT_REGISTRATION_REQUEST', signUp),
    takeLatest('FORGOT_PASSWORD_REQUEST', forgotPassword),
    takeLatest('REFRESH_PASSWORD', refreshPassword),

    takeLatest('GET_DIALOGS_REQUEST', getDialogs),

    takeLatest('GET_MESSAGES_REQUEST', getMessages),
    takeLatest('SEND_MESSAGE', sendMessage),

    takeLatest('CHANGE_USER_FIELD', changeUser)
  ])
}
