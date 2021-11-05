import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

import './index.css'

import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import LocalStorage from 'redux-persist/lib/storage'

import { reducer } from './reducers'
import rootSaga from './sagas/index'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

// create the persist Config
const persistConfig = {
  key: 'token',
  storage: LocalStorage
  // whitelist: ['SET_TOKEN'] // which reducer want to store
}

// wrap our main reducer in persist
const pReducer = persistReducer(persistConfig, reducer)

// create the saga middleware
const sagaMiddleware = createSagaMiddleware()

// create a redux store with our reducer above and middleware
const store = createStore(
  pReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

const persistor = persistStore(store)

// run the saga
sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
