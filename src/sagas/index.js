import { all, call, put, select, takeLatest } from 'redux-saga/effects'

import faker from 'faker'
import rsf from '../firebase'
import firebase from 'firebase'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-toastify'
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
      operatorRef.orderByChild('uid').equalTo(uid)
    )

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

async function firebaseCheckToken (token) {
  // eslint-disable-next-line
  return new Promise((resolve, _) => {
    firebase.auth().onAuthStateChanged((user) => {
      resolve(user.refreshToken === token)
    })
  })
}

function * checkToken () {
  try {
    const { token } = yield select(getAuthState)
    const isValidToken = yield call(firebaseCheckToken, token)

    if (!isValidToken) yield put({ type: 'RESET_REDUX' })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    throw new Error({
      ...errorMessage,
      path: 'saga-checkToken'
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

      const newOperator = {
        uid,
        email: action.user.email,
        avatar: urlRandomAvatar
      }
      const newOperatorStandard =
        AssignNewOperatorToDefaultOperatorSchema(newOperator)
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
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    user.password
  )
  return currentUser
    .reauthenticateWithCredential(credentials)
    .then((response) => ({ response }))
    .catch((error) => ({ error }))
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
      const { response } = yield call(reAuth, user, currentUser)

      if (response) {
        yield call(updatePass, currentUser, action)
        toast.success(
          '🦄 Пароль успешно обновлен! Зайдите заново с новым паролем',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
          }
        )
        yield put({ type: 'RESET_REDUX' })
      }
    } else {
      yield put({
        type: 'REFRESH_PASSWORD_ERROR',
        payload:
          'Старый пароль не совпадает, пожалуйста, проверьте правильность данных'
      })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    throw new Error({
      ...errorMessage,
      path: 'saga-refreshPassword'
    })
  }
}

// * dialogs Saga's

function * getDialogs () {
  try {
    const { user } = yield select(getAuthState)

    const tmpDialogs = {
      start: [],
      active: [],
      complete: [],
      save: []
    }

    // start принимаем все диалоги, а остальные только текущего оператора, другие видны не будут
    tmpDialogs.start = yield call(rsf.database.read, 'chat/start/')
    tmpDialogs.active = yield call(
      rsf.database.read,
      firebase
        .database()
        .ref('chat/active/')
        .orderByChild('operatorId')
        .equalTo(user.uid)
    )
    tmpDialogs.complete = yield call(
      rsf.database.read,
      firebase
        .database()
        .ref('chat/complete/')
        .orderByChild('operatorId')
        .equalTo(user.uid)
    )

    // удаляем null и Undefined значения
    let _array = null
    for (const key in tmpDialogs) {
      if (tmpDialogs[key] !== null) {
        if (!tmpDialogs[key].isArray) {
          _array = []
          for (const keyTmpDialogs in tmpDialogs[key]) _array.push(tmpDialogs[key][keyTmpDialogs])
          tmpDialogs[key] = _array
        }
        tmpDialogs[key].filter((item) => item !== null || typeof item !== 'undefined')
      } else {
        tmpDialogs[key] = []
      }
    }

    const dialogsLength = Object.keys(tmpDialogs).map((a) => tmpDialogs[a].length) // считаем длину

    const length = {
      start: dialogsLength[0],
      active: dialogsLength[1],
      complete: dialogsLength[2],
      save: dialogsLength[3]
    }

    yield put({
      type: 'GET_DIALOGS_SUCCESS',
      payload: { dialogs: tmpDialogs, length }
    })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'GET_DIALOGS_FAILURE', error: errorMessage })
    throw new Error({
      ...errorMessage,
      path: 'saga-getDialogs'
    })
  }
}

// * message Saga's

// Пока что не используется так как новые диалоги в очередь добавляются в ручную, а не через моб. приложение
function * checkOperator (action) {
  try {
    const { user } = yield select(getAuthState)
    const { status, index, message } = action.payload.dialogData

    const checkOperatorId = yield call(
      rsf.database.read,
      firebase.database().ref(`chat/${status}/${index}/operatorId`)
    )
    if (!checkOperatorId) {
      const newObject = {
        ...message,
        name: faker.name.findName(),
        avatar: faker.image.avatar(),
        operatorId: 123, // закрепляем оператора за диалогом
        status: 'active',
        uuid: uuidv4()
      }
      if (user.autoGreeting) {
        const timestamp = new Date()
        // добавляем авто-приветственное сообщение
        newObject.messages[newObject.messages.length] = {
          content: user.autoGreeting,
          timestamp: timestamp.toISOString(),
          writtenBy: 'operator'
        }
      }

      // (средствами realtime database firebase) - это означает удалить данную запись полностью
      // и создать новую в путе chat/active/${LastIndex} + 1 с новыми данными operatorId и status
      // создаем запись
      // для этого узнаем длину последнего элемента в активных чатах
      let lengthActiveDialogs = yield call(
        rsf.database.read,
        firebase.database().ref('chat/active/').limitToLast(1)
      )
      lengthActiveDialogs = Number(Object.keys(lengthActiveDialogs)[0]) + 1

      if (lengthActiveDialogs) {
        yield call(
          rsf.database.update,
          `chat/active/${lengthActiveDialogs}`,
          newObject
        )
      }

      // ! удаляем запись - пока что закоментиовано, чтобы не создавать каждый раз диалог в firebase
      // await firebase.database().ref(`chat/${status}/${index}`).remove((error) => {
      //   console.log(error)
      //   console.log('вроде как удалили - смотри firebase')
      // })
    }
    // проверяем поле operatorId в базе этого диалога
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    throw new Error({
      ...errorMessage,
      path: 'saga-checkToken'
    })
  }
}

function checkEndDialog (id) {
  // eslint-disable-next-line promise/param-names
  return new Promise((resolve, _) => {
    firebase
      .database()
      .ref('chat/complete')
      .orderByChild('uuid')
      .equalTo(id)
      .once('value')
      .then((snapshot) => {
        const tmp = Number(Object.keys(snapshot.val())[0])
        if (snapshot.val() !== null && 'rate' in snapshot.val()[tmp]) {
          resolve(true) // переведен в завершенный
        }
      })
  })
}

function * getMessages (action) {
  try {
    const { status, uuid } = action.payload
    const tmpObject = yield call(
      rsf.database.read,
      firebase
        .database()
        .ref(`chat/${status}`)
        .orderByChild('uuid')
        .equalTo(uuid)
    )

    if (tmpObject === null) {
      // проверяем на то, что пользователь закончил диалог
      const isEnd = checkEndDialog(uuid)
      if (isEnd) {
        yield put({ type: 'SET_END_DIALOGS', payload: true })
      }
    } else {
      const keyArray = +Object.keys(tmpObject)
      const messages = tmpObject[keyArray].messages
      yield put({
        type: 'GET_MESSAGES_SUCCESS',
        payload: { messages, index: keyArray, length: messages.length, id: uuid }
      })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
    throw new Error({
      ...errorMessage,
      path: 'saga-getMessages'
    })
  }
}

function * getTopics () {
  try {
    const topicsData = yield call(
      rsf.database.read,
      firebase.database().ref('topics/')
    )

    const newTopics = {
      topics: {},
      subtopics: {}
    }

    Object.keys(topicsData).forEach(item => {
      topicsData[item].forEach(st => {
        newTopics[item][st.value] = st.label
      })
    })

    yield put({ type: 'GET_TOPICS_SUCCESS', payload: newTopics })
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'GET_TOPICS_FAILURE', error: errorMessage })
    throw new Error({
      ...errorMessage,
      path: 'saga-getTopics'
    })
  }
}

function * sendMessage (action) {
  try {
    const { status, message } = action.payload
    const { messageLength, indexDialogUser, idDialogUser } = yield select(
      getMessagesState
    )
    const { filteredMessages } = yield select(getDialogsState)

    const dialogObject = filteredMessages[status].filter(
      (obj) => obj.uuid === idDialogUser
    )
    const chatMessageRef = firebase
      .database()
      .ref(`chat/${status}/${indexDialogUser}/messages/${messageLength}`)

    yield call(() => {
      // eslint-disable-next-line
      return new Promise((resolve, _) => {
        chatMessageRef.set(message)
        resolve(true)
      })
    })

    if (idDialogUser === dialogObject[0].uuid) {
      yield put({
        type: 'ADD_MESSAGE_TO_DIALOG',
        payload: { status, index: indexDialogUser, message, id: idDialogUser }
      })
    }
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    yield put({ type: 'GET_MESSAGES_FAILURE', error: errorMessage })
    throw new Error({
      ...errorMessage,
      path: 'saga-sendMessage'
    })
  }
}

// * User Saga's

function * changeUser () {
  try {
    const { user } = yield select(getAuthState)
    yield call(rsf.database.update, `operators/${user.keyFirebase}`, user)
  } catch (e) {
    const errorMessage = { code: e.code, message: e.message }
    throw new Error({
      ...errorMessage,
      path: 'saga-changeUser'
    })
  }
}

// dropping Saga's
function * resetRedux () {
  try {
    yield put({ type: 'RESET_STORE' })
    yield put({ type: 'RESET_DIALOGS_STORE' })
    yield put({ type: 'RESET_MESSAGE_STORE' })
  } catch (e) {
    throw new Error({
      ...e,
      path: 'saga-resetRedux'
    })
  }
}

export default function * rootSaga () {
  yield all([
    takeLatest('CHECKOUT_REQUEST', signIn),
    takeLatest('CHECK_TOKEN', checkToken),
    takeLatest('CHECKOUT_REGISTRATION_REQUEST', signUp),
    takeLatest('FORGOT_PASSWORD_REQUEST', forgotPassword),

    takeLatest('REFRESH_PASSWORD', refreshPassword),

    takeLatest('GET_DIALOGS_REQUEST', getDialogs),
    takeLatest('GET_TOPICS_REQUEST', getTopics),

    takeLatest('CHECK_ATTACH_OPERATOR', checkOperator),
    takeLatest('GET_MESSAGES_REQUEST', getMessages),
    takeLatest('SEND_MESSAGE', sendMessage),

    takeLatest('CHANGE_USER_FIELD', changeUser),

    takeLatest('RESET_REDUX', resetRedux)
  ])
}
