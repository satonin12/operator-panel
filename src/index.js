import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import './index.css'

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { reducer } from './reducers'
import rootSaga from './sagas/index'

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// create a redux store with our reducer above and middleware
let store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

// run the saga
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
