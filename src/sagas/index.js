import { takeLatest, put, call } from 'redux-saga/effects'

import rsf from '../firebase'

export function* watcherSaga() {
  yield takeLatest('CHECKOUT_REQUEST', signUp)
}

function* signUp(action) {
  try {
    console.log('зашли в action - auth')
    console.log(action.user.email, action.user.password)

    const data = yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.user.email,
      action.user.password
    )
    console.log(data)
    yield put({ type: 'CHECKOUT_SUCCESS', user: action.user })
    // yield put(checkoutSuccess(action))
  } catch (e) {
    console.log('зашли в ошибку')
    console.log(e)

    const e_msg = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_FAILURE', error: e_msg })
  }
}

export default function* rootSaga() {
  yield takeLatest('CHECKOUT_REQUEST', signUp)
}
