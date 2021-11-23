import React, { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import firebase from 'firebase'
import {
  StarOutlined,
  StarFilled
} from '@ant-design/icons'

import LabelInput from '../Inputs/LabelInput/LabelInput'
import DialogMessage from './DialogMessage/DialogMessage'
import Button from '../Button/Button'

import './index.scss'
import { useDispatch, useSelector } from 'react-redux'

const Dialog = ({ obj, transferToActive, handlerOpenProfile, ...props }) => {
  const status = obj.status
  // eslint-disable-next-line no-prototype-builtins
  const index = obj.message.hasOwnProperty('indexBefore') ? obj.message.indexBefore : obj.index
  if (typeof index === 'undefined') { throw Error('ошибка индексации - in Dialog props') }

  const dispatch = useDispatch()
  const [value, setValue] = useState('')
  const { messages } = useSelector((state) => state.message)

  const getMessages = useCallback(async () => {
    dispatch({ type: 'GET_MESSAGES_REQUEST', payload: { status, uuid: obj.message.uuid } })
  }, [dispatch, status, obj.message.uuid])

  const checkDialogOperatorId = async () => {
    let checkOperatorId = null
    await firebase
      .database()
      .ref(`chat/${status}/${index}/operatorId`)
      .once('value', (snapshot) => {
        if (snapshot.val() === 0) {
          checkOperatorId = true
        }
      })

    // если оператор не закреплен
    if (checkOperatorId) {
      const transferObject = obj.message
      const newObject = {
        ...transferObject,
        operatorId: 123,
        status: 'active',
        uuid: uuidv4()
      }
      // сразу же закрепляем оператора за диалогом
      // (средствами realtime database firebase) - это означает удалить данную запись полностью и создать новую в путе chat/active/${LastIndex} + 1 с новыми данными operatorId и status
      let lengthActiveDialogs
      // создаем запись
      // для этого узнаем длину последнего элемента в активных чатах
      await firebase
        .database()
        .ref('chat/active/')
        .limitToLast(1)
        .once('value', (snapshot) => {
          lengthActiveDialogs = Number(Object.keys(snapshot.val())[0]) + 1
        })

      if (lengthActiveDialogs) {
        // TODO: id оператора брать из контекста после входа
        await firebase
          .database()
          .ref(`chat/active/${lengthActiveDialogs}`)
          .set(newObject, (error) => {
            if (error) {
              console.log(error)
            } else {
              console.log('добавление прошло удачно - смотри firebase')
            }
          })
      } else {
        throw Error('Ошибка lengthActiveDialogs!!!')
      }

      const newObjectFromDialogsItem = {
        index: lengthActiveDialogs,
        message: newObject,
        status: 'active'
      }
      // ! удаляем запись - пока что закоментиовано, чтобы не создавать каждый раз диалог в firebase
      // await firebase.database().ref(`chat/${status}/${index}`).remove((error) => {
      //   console.log(error)
      //   console.log('вроде как удалили - смотри firebase')
      // })
      //  после всего этого нужно перерендерить компонент homepage, чтобы текущий диалог встал в карточку 'active'
      //  для этого вручную кладём текущий dialogItem в массив active
      transferToActive(newObjectFromDialogsItem)
    }
  }

  useEffect(() => {
    // проверка, если этот диалог без operatorId в firebase -> значит переводим в активный за текущим оператором (пока что константа 123)
    checkDialogOperatorId()
    getMessages()
    // eslint-disable-next-line
  }, [])

  const handlerSendMessage = async () => {
    if (value.trim().length) {
      const timestamp = new Date()
      try {
        dispatch({
          type: 'SEND_MESSAGE',
          payload: {
            status,
            message: {
              content: value,
              timestamp: timestamp.toISOString(),
              writtenBy: 'operator'
            }
          }
        })
      } catch (e) {
        console.log(e)
      }
      getMessages()
      setValue('')
    }
  }

  return (
    <div className='Dialog'>
      <div className='Dialog--item HeaderBlock'>
        <div className='HeaderBlock--item DialogUserBlock'>
          <div className='DialogAvatar'>
            <img
              src={obj.message.avatar}
              alt='AvatarPicture'
              width={60}
              height={60}
            />
          </div>
          <div className='DialogName'>{obj.message.name}</div>
        </div>

        <div className='HeaderBlock--item'>
          <div className='HeaderBlock--Profile'>
            <Button onClick={handlerOpenProfile}>Открыть профиль</Button>
          </div>
        </div>

      </div>
      <div className='Dialog--item DialogContent'>
        <div className='Content--Scroll'>
          {messages.map((item, index) => (
            <DialogMessage key={index + Date.now()} messages={item} />
          ))}
        </div>
      </div>
      <div className='Dialog--item FooterBlock'>
        {status === 'complete'
          ? (
            <div className='FeedbackBlock'>
              <h5>Этот диалог завершился !!!</h5>
              <div className='FeedbackBlock--Star'>
                <StarFilled style={{ fontSize: '40px', color: '#DB0006' }} />
                <StarFilled style={{ fontSize: '40px', color: '#DB0006' }} />
                <StarFilled style={{ fontSize: '40px', color: '#DB0006' }} />
                <StarOutlined style={{ fontSize: '40px', color: '#DB0006' }} />
                <StarOutlined style={{ fontSize: '40px', color: '#DB0006' }} />
              </div>
            </div>
            )
          : (
            <div className='AnswerBlock'>
              {/* TODO: заменить на textarea */}
              <LabelInput
                value={value}
                placeholder=' '
                label='Введите ответ'
                onChange={(e) => setValue(e.target.value)}
              />
              <Button onClick={handlerSendMessage}>Отправить сообщение</Button>
              <select>
                <option disabled>Выберите из готовых варинатов</option>
                <option>Здравтсвтуйте, хорошего вам дня!</option>
                <option>Прогу прощения, не могли бы вы повторить</option>
                <option>В данный момент все операторы заняты, ожидайте</option>
                <option>Опишите проблему поподробнее</option>
              </select>
            </div>
            )}
      </div>
    </div>
  )
}

export default Dialog
