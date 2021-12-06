import React, { createRef, useCallback, useEffect, useState, useRef } from 'react'
import faker from 'faker'
import firebase from 'firebase'
import { v4 as uuidv4 } from 'uuid'
import {
  StarFilled,
  SmileTwoTone,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons'
import Picker from 'emoji-picker-react'
import { AutoComplete } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import { usePubNub } from 'pubnub-react'

import LabelInput from '../Inputs/LabelInput/LabelInput'
import DialogMessage from './DialogMessage/DialogMessage'
import Button from '../Button/Button'

import './index.scss'

function useInterval (callback, delay) {
  const savedCallback = useRef()

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick () {
      savedCallback.current()
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const Dialog = ({ dialogData, transferToActive, handlerOpenProfile }) => {
  const status = dialogData.status
  // eslint-disable-next-line no-prototype-builtins
  // const index = dialogData.message.hasOwnProperty('indexBefore') ? dialogData.message.indexBefore : dialogData.index
  // if (typeof index === 'undefined') { throw Error('ошибка индексации - in Dialog props') }

  const idDialog = dialogData.id

  // * pubnup
  let timeoutCache = 0
  const pubnub = usePubNub()
  const [channels] = useState([dialogData.message.name])

  const dispatch = useDispatch()
  const { messages } = useSelector((state) => state.message)
  const { autoGreeting, readyPhrases } = useSelector((state) => state.auth.user)

  const delay = 30000 // 30 секунд
  const inputRef = createRef()
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([]) // for hints when entering the text of ready-made phrases
  const [isTyping, setIsTyping] = useState(false)
  const [attachImage, setAttachImage] = useState([])
  const [isGetMessages, setIsGetMessages] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const getMessages = useCallback(async () => {
    setIsGetMessages(false)
    dispatch({ type: 'GET_MESSAGES_REQUEST', payload: { status, uuid: dialogData.message.uuid } })
    setIsGetMessages(true)
  }, [dispatch, status, dialogData.message.uuid])

  const checkDialogOperatorId = async () => {
    // понадобится после того как появится моб. приложения
    // dispatch({ type: 'CHECK_ATTACH_OPERATOR', payload: { dialogData } })

    let checkOperatorId = null
    await firebase
      .database()
      .ref(`chat/${status}/`)
      .orderByChild('uuid')
      .equalTo(idDialog)
      .once('value', (snapshot) => {
        const dialogObject = snapshot.val()[Object.keys(snapshot.val())]
        if (dialogObject.operatorId === 0) {
          checkOperatorId = true
        }
      })

    // если оператор не закреплен
    if (checkOperatorId) {
      const newObject = {
        ...dialogData.message,
        name: faker.name.findName(),
        avatar: faker.image.avatar(),
        operatorId: 123,
        status: 'active',
        uuid: uuidv4()
      }

      // и есть авто-приветственное сообщение
      if (autoGreeting) {
        const timestamp = new Date()
        // то добавляем его
        newObject.messages[newObject.messages.length] = {
          content: autoGreeting,
          timestamp: timestamp.toISOString(),
          writtenBy: 'operator'
        }
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

  useInterval(() => {
    getMessages()
  }, isGetMessages ? delay : null)

  const hideTypingIndicator = () => { setIsTyping(false) }

  const handleSignal = (event) => {
    clearTimeout(timeoutCache)
    setIsTyping(true)
    timeoutCache = setTimeout(hideTypingIndicator, 3000) // 3 seconds

    if (event.message === '0') {
      hideTypingIndicator()
    }
  }

  const handleMessage = () => { hideTypingIndicator() }

  useEffect(() => {
    pubnub.addListener({
      message: handleMessage,
      signal: handleSignal
    })
    pubnub.subscribe({ channels })
    // eslint-disable-next-line
  }, [pubnub, channels])

  const handlerSendMessage = () => {
    if (value.trim().length || attachImage.length !== 0) {
      hideTypingIndicator()
      const timestamp = new Date()
      try {
        if (attachImage.length !== 0) {
          dispatch({
            type: 'SEND_MESSAGE',
            payload: {
              status: status,
              message: {
                content: value,
                timestamp: timestamp.toISOString(),
                writtenBy: 'operator',
                image_url: attachImage
              }
            }
          })
        } else {
          dispatch({
            type: 'SEND_MESSAGE',
            payload: {
              status: status,
              message: {
                content: value,
                timestamp: timestamp.toISOString(),
                writtenBy: 'operator'
              }
            }
          })
        }
      } catch (e) {
        console.log(e)
      }
      pubnub.publish({ channel: channels[0], message: value })
      getMessages()
      setValue('')
      setOptions([])
      setShowEmojiPicker(false)
      setAttachImage([])
    }
  }

  const setInputFocus = () => inputRef.current.focus()

  const onEmojiClick = (e, emojiObject) => {
    setValue(value + emojiObject.emoji)
    setInputFocus()
  }

  const uploadImage = () => {
    try {
      window.cloudinary.openUploadWidget({
        cloud_name: 'dyjcgnzq7', upload_preset: 'operators_uploads', tags: ['xmas']
        // eslint-disable-next-line
      }, (error, result) => {
        if (error?.message !== 'User closed widget') {
          const resultTmp = result
          const arr = []
          resultTmp.map((item) => arr.push({ src: item.url }))
          setAttachImage(arr)
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  const onSelect = (selectedValue) => {
    if (value !== '') setValue(selectedValue)
  }

  const handleSearch = (searchValue) => {
    const filteredOptions = readyPhrases.filter((phrase) => {
      return (
        phrase.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    })
    const tmp = filteredOptions.map((item) => {
      return { value: item.text }
    })

    setOptions(tmp)
  }

  const handlerInputChange = (e) => {
    // отправляем в pubnup в канал нашего диалога сигнал о том, что мы печатаем
    pubnub.signal({
      message: 'typing_on',
      channel: channels
    })
    setValue(e.target.value)
  }

  // TODO: вынести блок ввода и прикрепления фотографий в отдельный компонент
  return (
    <div className='Dialog'>
      <div className='Dialog--item HeaderBlock'>
        <div className='HeaderBlock--item DialogUserBlock'>
          <div className='DialogAvatar'>
            <img
              src={dialogData.message.avatar}
              alt='AvatarPicture'
              width={60}
              height={60}
            />
          </div>
          <div className='DialogName'>{dialogData.message.name}</div>
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
          {
            isTyping &&
              <div className='typingundicator'>
                {dialogData.message.name} is Typing ...
              </div>
          }
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
              <button className='AnswerBlock--SmileButton' onClick={uploadImage}>
                <UploadOutlined twoToneColor='#1890ff' />
                {/* TODO: переделать на Pictures Wall antd (https://ant.design/components/upload/#components-upload-demo-picture-card) */}
                {/* TODO: добавить Badge от antd */}
                {attachImage.length > 0 && <span className='AttachCount'>{attachImage.length}</span>}
              </button>
              <button className='AnswerBlock--SmileButton' onClick={() => setShowEmojiPicker(prevState => !prevState)}>
                <SmileTwoTone twoToneColor='#1890ff' />
              </button>
              {showEmojiPicker &&
                <Picker
                  onEmojiClick={onEmojiClick}
                  preload
                />}

              <AutoComplete
                value={value}
                style={{
                  width: '100%'
                }}
                options={options}
                onSelect={onSelect}
                onSearch={handleSearch}
              >
                {/* TODO: заменить на textarea */}
                <LabelInput
                  ref={inputRef}
                  placeholder=' '
                  label='Введите ответ'
                  onChange={handlerInputChange}
                />
              </AutoComplete>
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
