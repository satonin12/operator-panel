import React, { createRef, useCallback, useEffect, useState } from 'react'
import firebase from 'firebase'
import {
  StarFilled,
  SmileTwoTone,
  StarOutlined,
  UploadOutlined
} from '@ant-design/icons'
import Picker from 'emoji-picker-react'
import { usePubNub } from 'pubnub-react'
import clonedeep from 'lodash.clonedeep'
import { AutoComplete, Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../Button/Button'
import useInterval from '../../hooks/useInterval'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import DialogMessage from './DialogMessage/DialogMessage'

import './index.scss'

const Dialog = ({ dialogData, transferToActive, handlerOpenProfile, onEndDialog }) => {
  const { id, status } = dialogData

  // * pubnup
  let timeoutCache = 0
  const pubnub = usePubNub()
  const [channels] = useState([id])

  const dispatch = useDispatch()
  const { messages } = useSelector((state) => state.message)
  const { isEndDialog } = useSelector((state) => state.dialog)
  const { autoGreeting, readyPhrases, uid } = useSelector((state) => state.auth.user)

  const { confirm } = Modal
  const delay = 5000 // 30 секунд
  const inputRef = createRef()
  const [value, setValue] = useState('')
  const [options, setOptions] = useState([]) // for hints when entering the text of ready-made phrases
  const [isTyping, setIsTyping] = useState(false)
  const [attachImage, setAttachImage] = useState([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const getMessages = useCallback(async () => {
    dispatch({ type: 'GET_MESSAGES_REQUEST', payload: { status, uuid: dialogData.message.uuid } })
  }, [dispatch, status, dialogData.message.uuid])

  const checkDialogOperatorId = async () => {
    let newObject = {}
    const transferedObject = clonedeep(dialogData.message)
    let checkOperatorId = null
    await firebase
      .database()
      .ref(`chat/${status}/`)
      .orderByChild('uuid')
      .equalTo(id)
      .once('value', (snapshot) => {
        const dialogObject = snapshot.val()[Object.keys(snapshot.val())]
        if (dialogObject.operatorId === 0) {
          checkOperatorId = true
        }
      })

    // если оператор не закреплен
    if (checkOperatorId) {
      newObject = {
        ...transferedObject,
        // меняем на текущего оператора и присваиваем статус active, чтобы удалить у других операторов
        operatorId: uid,
        status: 'active'
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
              throw new Error({
                ...error,
                path: 'Dialog-checkDialogOperatorId'
              })
            }
          })
      } else {
        throw new Error('lengthActiveDialogs not true')
      }

      const newObjectFromDialogsItem = {
        index: lengthActiveDialogs,
        message: newObject,
        status: 'active'
      }

      // удаляем запись из очереди
      await firebase
        .database()
        .ref(`chat/${status}/`)
        .orderByChild('uuid')
        .equalTo(id)
        .once('value', (snapshot) => {
          snapshot.forEach((child) => {
            child.ref.remove()
          })
        })
      //  после всего этого нужно перерендерить компонент homepage, чтобы текущий диалог встал в карточку 'active'
      //  для этого вручную кладём текущий dialogItem в массив active
      transferToActive(newObjectFromDialogsItem)
      if ('deviceId' in dialogData.message) {
        sendNotification()
      }
    }
  }

  useEffect(() => {
    // проверка, если этот диалог без operatorId в firebase -> значит переводим в активный за текущим оператором (пока что константа 123)
    if (!isEndDialog) checkDialogOperatorId()
    getMessages()
    // eslint-disable-next-line
  }, [])

  useInterval(() => {
    getMessages()
  }, delay)

  const hideTypingIndicator = () => { setIsTyping(false) }

  const handleSignal = (event) => {
    if (event.message === 'typing_on_client') {
      clearTimeout(timeoutCache)
      setIsTyping(true)
      timeoutCache = setTimeout(hideTypingIndicator, 3000) // 3 seconds

      if (event.message === '0') {
        hideTypingIndicator()
      }
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

  const showConfirm = () => {
    confirm({
      title: 'Этот пользователь завершил диалог !!!',
      content: 'Нажмите ОК, чтобы продолжить',
      onOk () {
        dispatch({ type: 'SET_END_DIALOGS', payload: false })
        dispatch({ type: 'GET_DIALOGS_REQUEST' })
        onEndDialog()
      },
      okType: 'danger'
    })
  }

  useEffect(() => {
    if (isEndDialog) showConfirm()
    // eslint-disable-next-line
  }, [isEndDialog])

  const sendNotification = () => {
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Basic NThhZTIxNjMtZmI2MC00NDEzLWI3Y2EtYmU1OThjODYzMDRi'
    }
    const endpoint = 'https://onesignal.com/api/v1/notifications'
    const params = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        app_id: '23e26e2f-9643-4633-8055-e32259dae838',
        filters: [ // Will send notification only to specific device
          {
            field: 'tag',
            key: dialogData.message.deviceId ? 'id_device' : 'custom_id',
            relation: '=',
            value: dialogData.message.deviceId ? dialogData.message.deviceId : id
          }
        ],
        headings: { en: 'Your Heading' },
        contents: { en: 'This notification is from RN code' }
        // url: 'https://something.any' // optional
      })
    }
    window.fetch(endpoint, params)
      .then(res => console.log(res))
      .catch((error) => {
        throw new Error({
          ...error,
          path: 'Dialog-sendNotification'
        })
      })
  }

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
        throw new Error({
          ...e,
          path: 'Dialog-handlerSendMessage'
        })
      }

      if (value.trim().length) {
        pubnub.publish({ channel: channels[0], message: { isImage: false, value } })
      } else {
        pubnub.publish({ channel: channels[0], message: { images: attachImage, isImage: true } })
      }

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
      throw new Error({
        ...e,
        path: 'Dialog-uploadImage'
      })
    }
  }

  const onSelect = (selectedValue) => {
    if (value !== '') setValue(selectedValue)
  }

  const handleSearch = (searchValue) => {
    if (Array.isArray(readyPhrases) && (typeof readyPhrases !== 'undefined' || readyPhrases !== null)) {
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
  }

  const handlerInputChange = (e) => {
    // отправляем в pubnup в канал нашего диалога сигнал о том, что мы печатаем
    pubnub.signal({
      message: 'typing_on_operator',
      channel: channels
    })
    setValue(e.target.value)
  }

  // * JSX Variables

  const renderFeedBackRate = rate => {
    const content = []
    let item = null
    for (let i = 1; i <= 5; i++) {
      item = (rate < i) ? <StarOutlined style={{ fontSize: '40px', color: '#DB0006' }} /> : <StarFilled style={{ fontSize: '40px', color: '#DB0006' }} />
      content.push(item)
    }
    return content
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
            <DialogMessage key={messages[0].timestamp + '_' + index.toString()} messages={item} />
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
                {renderFeedBackRate(dialogData.message.rate)}
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
