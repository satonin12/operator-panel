import { all, fork } from 'redux-saga/effects'

import * as actions from '../actions'

export function* checkout() {
  try {
    // что-то пробуем
  } catch (error) {
    // какая-то ошибка
  }
}

export default function* rootSaga() {
  yield all([fork(checkout)])
}
