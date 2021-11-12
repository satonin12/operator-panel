import firebase from 'firebase/app'
import 'firebase/auth'
import ReduxSagaFirebase from 'redux-saga-firebase'

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyD2C0YZCfsFzH-_ZrP-HutnsNwX6ABmook',
  authDomain: 'vsatonin-intership-login.firebaseapp.com',
  databaseURL: 'https://vsatonin-intership-login-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vsatonin-intership-login',
  storageBucket: 'vsatonin-intership-login.appspot.com',
  messagingSenderId: '16186507247',
  appId: '1:16186507247:web:2d6581b602570a69d7c01a',
  measurementId: 'G-LN3JK1WSZM'
})

const rsf = new ReduxSagaFirebase(firebaseApp)
export default rsf
