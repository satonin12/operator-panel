import React, { useEffect, useState } from 'react'

import './index.scss'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Input from '../Inputs/Input/Input'
import DialogMessage from './DialogMessage/DialogMessage'
import Button from '../Button/Button'

import firebase from 'firebase'

const Dialog = (props) => {
  const status = props.obj.status
  const index = props.obj.index
  // let messagesLength = props.obj.message.messages.length

  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const [messagesLength, setMessageLength] = useState(props.obj.message.messages.length || 0)

  const getMessages = () => {
    firebase.database().ref(`chat/${status}/${index}/messages/`).once('value', (snapshot) => {
      const tmp = snapshot.val()
      setMessages(tmp)
    })
  }

  useEffect(() => {
    getMessages()
  }, [])

  const handlerSendMessage = async () => {
    const timestamp = Date.now()
    const timestampServer = firebase.firestore.FieldValue.serverTimestamp() // можно использовать ф-ию firebase т.к. время компьютера клиента не всегда может быть правильное
    firebase.database().ref(`chat/${status}/${index}/messages/${messagesLength}`).set({
      content: value,
      timestamp: timestamp || timestampServer,
      writtenBy: 'operator'
    }, (error) => {
      if (error) {
        console.log(error)//
      } else {
        console.log('все прошло удачно')
        setMessageLength(prevState => prevState + 1)
      }
    })
    setValue('')
    console.log(status, index, messagesLength)
  }

  useEffect(() => {
    getMessages()
  }, [value])

  return (
    <div className='Dialog'>
      <div className='Dialog--item HeaderBlock'>
        <div className='HeaderBlock--item DialogUserBlock'>
          <div className='DialogAvatar'>
            <img
              src={props.obj.message.avatar}
              alt='AvatarPicture'
              width={60}
              height={60}
            />
          </div>
          <div className='DialogName'>{props.obj.message.name}</div>
        </div>

        <div className='HeaderBlock--item'>
          <div className='HeaderBlock--search'>
            <Input placeholder='Найти сообщение' />
          </div>
        </div>
      </div>
      <div className='Dialog--item DialogContent'>
        {messages.map((item, index) => (
          <DialogMessage key={index} messages={item} />
        ))}
      </div>
      <div className='Dialog--item FooterBlock'>
        <div className='AnswerBlock'>
          <LabelInput label='Введите ответ' onChange={e => setValue(e.target.value)} value={value} />
          <Button onClick={handlerSendMessage}>Отправить сообщение</Button>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Dialog
