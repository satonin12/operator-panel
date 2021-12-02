import AppRouter from './router/AppRouter'

import PubNub from 'pubnub'
import { PubNubProvider } from 'pubnub-react'

import './App.scss'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const pubnub = new PubNub({
  publishKey: 'pub-c-4d7ac2be-7395-4fa7-a74d-f5b7efa8e439',
  subscribeKey: 'sub-c-000c0078-5349-11ec-8a85-9eadcf5c6378',
  uuid: 'sub-c-000c0078-5349-11ec-8a85-9eadcf5c6378'
})

function App () {
  return (
    <PubNubProvider client={pubnub}>
      <div className='App'>
        <AppRouter />
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </PubNubProvider>
  )
}

export default App
