import React, { useEffect, useMemo, useState } from 'react'
import { Result, Tabs } from 'antd'
import {
  HomeTwoTone,
  CheckSquareTwoTone,
  SaveTwoTone,
  SmileOutlined
} from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import debounce from 'lodash.debounce'
// import throttle from 'lodash.throttle'

import Button from '../../components/Button/Button'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import MessageItem from '../../components/MessageItem/MessageItem'
import Dialog from '../../components/Dialog/Dialog'

import firebase from 'firebase'

import dataMessage from '../../utils/dataMessage.json'

import './index.scss'

const HoomRoom = () => {
  const db = firebase.database().ref('chat/')

  const { TabPane } = Tabs
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state)

  const [dialogs, setDialogs] = useState([])

  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть окно профиля
  const [messages, setMessages] = useState([]) // состояние для сообщений с сервера
  const [filteredMessages, setFilteredMessages] = useState(dataMessage) // состояние для отфильтрованные сообщений

  const [isOpenDialog, setIsOpenDialog] = useState(false) // состояние для определения открыт ли диалог или нет
  const [activeDialog, setActiveDialog] = useState({})

  const handleShowProfile = () => setIsOpen(prevState => !prevState)

  const getData = () => {
    db.once('value', (snapshot) => {
      const tmp = snapshot.val()
      // console.log(tmp)
      // const test = Object.values(tmp.reduce((acc, c) => (c.status in acc ? acc[c.status].push(c) : acc[c.status] = [c], acc), {}))
      // console.log(test)
      setDialogs(tmp)
    })
  }

  useEffect(() => {
    const checkToken = async () => {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user.refreshToken !== token) {
          // возвращаем пользователя на страницу авторизации с помощью setAuth = false
          dispatch({ type: 'RESET_STORE' })
        }
      })
    }

    checkToken()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase()
    // поиск по имени, сообщению
    const filteredData = messages.filter((item) => {
      return (
        item.name.toLowerCase().includes(value) ||
        item.message.toLowerCase().includes(value)
      )
    })
    setFilteredMessages(filteredData)
  }

  /* Различия использования между debounce & throttle
    * Наша функцию debouncedHandlerSearch вызовется несколько раз, но она вызовет функцию handleSearch лишь раз после того, как закончится wait, который мы передаем вторым параметром debounce -> (_, wait: 300)
    * её будем использовать для поиска необходимого нам сообщения, дабы не фильтровать сообщения каждый раз при вводе её пользователем
    *
    * Функцию throttledHandlerSearch используем для связи с сервером т.к. она вызовется не более чем одного раза в заданное время ожидания (пока что не требуется)
    *
    * обе функции требуют, чтобы отлаженная функия должна оставаться неизменной -> для этого оборачиваем в useMemo
  */

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandlerSearch = useMemo(() => {
    return debounce(handlerSearch, 500)
  })

  // const throttledHandlerSearch = useMemo(() => {
  //   return throttle(handlerSearch, 300)
  // })

  const handlerExit = () => {
    const answer = window.confirm('Вы точно хотите выйти ?')
    if (answer) dispatch({ type: 'RESET_STORE' })
  }

  const handlerSetActiveDialog = (e) => {
    // console.log(e)
    setActiveDialog(e)
    setIsOpenDialog(prevState => !prevState)
  }

  return (
    <>
      <div className='MainLayout'>
        <div className='HomePage'>
          <div className='HomePage--item LeftPanel'>
            <div className='TitleBlock'>
              <div className='TitleBlock--Name'>operator@mail.ru</div>
              <div className='TitleBlock--Exit'>
                <Button styleButton='primary' onClick={handlerExit}>Выйти</Button>
              </div>
            </div>
            <div className='SearchBlock'>
              <div className='SearchBlock--Search'>
                <LabelInput
                  label='Search here...'
                  name='searchUser'
                  type='text'
                  placeholder=''
                  onChange={debouncedHandlerSearch}
                />
              </div>
            </div>
            <Tabs defaultActiveKey='1' size='large' centered type='line'>

              <TabPane
                tab={
                  <span>
                    <HomeTwoTone twoToneColor='#585FEB' />
                  </span>
                }
                key='1'
              >
                <div className='MessageList'>
                  {dialogs.map((message, index) => {
                    if (message.status === 'complete') {
                      return (
                        <MessageItem
                          key={index + message.name}
                          avatar={message.avatar}
                          name={message.name}
                          date={message.date}
                          message={message.messages[0].content}
                          onClick={() => handlerSetActiveDialog({ index, message })}
                        />
                      )
                    }
                  })}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <CheckSquareTwoTone twoToneColor='#7FEB8F' />
                  </span>
                }
                key='2'
              >
                <div className='MessageList'>
                  {dialogs.map((message, index) => {
                    if (message.status === 'save') {
                      return (
                        <MessageItem
                          key={index + message.name}
                          avatar={message.avatar}
                          name={message.name}
                          date={message.date}
                          message={message.messages[0].content}
                          onClick={() => handlerSetActiveDialog({ index, message })}
                        />
                      )
                    }
                  })}
                </div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <SaveTwoTone twoToneColor='#EBE097' />
                  </span>
                }
                key='3'
              >
                <div className='MessageList'>
                  {dialogs.map((message, index) => {
                    if (message.status === 'active') {
                      return (
                        <MessageItem
                          key={index + message.name}
                          avatar={message.avatar}
                          name={message.name}
                          date={message.date}
                          message={message.messages[0].content}
                          onClick={() => handlerSetActiveDialog({ index, message })}
                        />
                      )
                    }
                  })}
                </div>
              </TabPane>
            </Tabs>
          </div>
          <div className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog obj={activeDialog} />
                )
              : (
                <Result
                  icon={<SmileOutlined />}
                  title='Выберите диалог чтобы начать!'
                  extra={<Button onClick={handleShowProfile}>Открыть окно профиля</Button>}
                />
                )}
          </div>
          <div className='HomePage--item RightPanel'>
            <Offcanvas
              backdrop={false}
              fade={false}
              direction='end'
              isOpen={isOpen}
              toggle={handleShowProfile}
            >
              <OffcanvasHeader toggle={handleShowProfile}>
                <p>Avatar image</p>
                <p>Author name</p>
              </OffcanvasHeader>
              <OffcanvasBody>
                <p>Author small information</p>
                <p>Contact</p>
                <p>Media</p>
              </OffcanvasBody>
            </Offcanvas>
          </div>
        </div>
      </div>
    </>
  )
}

export default HoomRoom
