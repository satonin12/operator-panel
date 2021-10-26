import { takeLatest, put, call, all } from 'redux-saga/effects'

import rsf from '../firebase'

function* signUp(action) {
  try {
    const data = yield call(
      rsf.auth.signInWithEmailAndPassword,
      action.user.email,
      action.user.password
    )
    yield put({ type: 'CHECKOUT_SUCCESS', user: action.user }) // save user data in our form
    // yield put({ type: 'CHECKOUT_SUCCESS', user: data }) // save user data in firebase response
  } catch (e) {
    const e_msg = { code: e.code, message: e.message }
    yield put({ type: 'CHECKOUT_FAILURE', error: e_msg })
  }
}

export default function* rootSaga() {
  yield all([takeLatest('CHECKOUT_REQUEST', signUp)])
}
