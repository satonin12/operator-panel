import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createStore, applyMiddleware, combineReducers } from 'redux'

import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'
import rootSaga from './sagas/index'
import { authReducer } from './reducers/authReducers'
import { dialogReducer } from './reducers/dialogReducers'

import './index.css'

// create the persist Config
const rootPersistConfig = {
  key: 'root',
  storage: storage
}
const authPersistConfig = {
  key: 'auth',
  storage: storage,
  blacklist: ['isAuth']
}
const dialogPersistConfig = {
  key: 'dialog',
  storage: storage
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  dialog: persistReducer(dialogPersistConfig, dialogReducer)
})

// wrap our main reducer in persist
const pReducer = persistReducer(rootPersistConfig, rootReducer)

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
