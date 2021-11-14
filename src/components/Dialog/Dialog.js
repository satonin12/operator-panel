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

  const [indexProps, setIndexProps] = useState(null)

  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const [messagesLength, setMessageLength] = useState(props.obj.message.messages.length || 0)

  const getMessages = () => {
    firebase.database().ref(`chat/${status}/${index}/messages/`).once('value', (snapshot) => {
      const tmp = snapshot.val()
      setMessages(tmp)
    })
  }

  const checkDialogOperatorId = () => {
    console.log(props)
    firebase.database().ref(`chat/${status}/${index}/operatorId`).once('value', snapshot => {
      if (snapshot.val() === 0) {
        // const transferObject = props.obj.message
        // сразу же закрепляем оператора за диалогом
        // (средствами realtime database firebase) - это означает удалить данную запись полностью и создать новую в путе chat/active/${LastIndex} + 1 с новыми данными operatorId и status
        // let lengthActiveDialogs
        //  создаем запись
        //  для этого узнаем длину последнего элемента в активных чатах
        // firebase.database().ref('chat/active/').limitToLast(1).once('value', snapshot => {
        //   lengthActiveDialogs = Number(Object.keys(snapshot.val())[0]) + 1
        //   // TODO: id оператора брать из контекста после входа
        //   const newObject = {
        //     ...transferObject,
        //     operatorId: 123,
        //     status: 'active'
        //   }
        //   firebase.database().ref(`chat/active/${lengthActiveDialogs}`).set(newObject,
        //     (error) => {
        //       if (error) {
        //         console.log(error)
        //       } else {
        //         console.log('добавление прошло удачно - смотри firebase')
        //       }
        //     })
        // })
        // //  удаляем запись
        // firebase.database().ref(`chat/${status}/${index}`).remove((error) => {
        //   console.log(error)
        //   console.log('вроде как удалили - смотри firebase')
        // })

        //  после всего этого нужно перерендерить компонент homepage, чтобы текущий диалог встал в карточку 'active'
        //  для этого вручную кладём текущий dialogItem в массив active
      }
    })
  }

  useEffect(() => {
    console.log('получаем сообщения - первый раз')
    getMessages()
    // проверка, если этот диалог без operatorId в firebase -> значит переводим в активный за текущим оператором (пока что константа 123)
    checkDialogOperatorId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // console.log('получаем сообщения - при изменении value')
    getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    setIndexProps(props.key)
  }, [indexProps])

  const handlerSendMessage = async () => {
    const timestamp = Date.now()
    const timestampServer = firebase.firestore.FieldValue.serverTimestamp() // можно использовать ф-ию firebase т.к. время компьютера клиента не всегда может быть правильное
    firebase.database().ref(`chat/${status}/${index}/messages/${messagesLength}`).set({
      content: value,
      timestamp: timestamp || timestampServer,
      writtenBy: 'operator'
    }, (error) => {
      if (error) {
        console.log(error)
      } else {
        setMessageLength(prevState => prevState + 1)
      }
    })
    setValue('')
  }

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
