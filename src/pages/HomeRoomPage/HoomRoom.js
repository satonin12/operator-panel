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
import InfiniteScroll from 'react-infinite-scroll-component'

import Button from '../../components/Button/Button'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import MessageItem from '../../components/MessageItem/MessageItem'
import Dialog from '../../components/Dialog/Dialog'

import firebase from 'firebase'

import './index.scss'

const activeTabIcon = (
  <HomeTwoTone twoToneColor='#585FEB' />
)
const completeTabIcon = (
  <CheckSquareTwoTone twoToneColor='#7FEB8F' />
)
const saveTabIcon = (
  <SaveTwoTone twoToneColor='#EBE097' />
)

const tabPanelArray = [
  {
    status: 'active',
    key: 1,
    componentIcon: activeTabIcon
  },
  {
    status: 'complete',
    key: 2,
    componentIcon: completeTabIcon
  },
  {
    status: 'save',
    key: 3,
    componentIcon: saveTabIcon
  }
]

const HoomRoom = () => {
  const db = firebase.database()

  const { TabPane } = Tabs
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state)

  const hasMore = true

  const [dialogs, setDialogs] = useState({ active: [], complete: [], save: [] })
  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть окно профиля
  // TODO: сделать фильтрацию элементов, после ее получения из firebase
  const [filteredMessages, setFilteredMessages] = useState({ active: [], complete: [], save: [] }) // состояние для отфильтрованные сообщений

  // понадобится позже при пагинации диалогов
  const [lengthDialogs, setLengthDialogs] = useState({
    active: 0,
    complete: 0,
    save: 0
  })

  const [isOpenDialog, setIsOpenDialog] = useState(false) // состояние для определения открыт ли диалог или нет
  const [activeDialog, setActiveDialog] = useState({})
  const [activeTab, setActiveTab] = useState('active')

  const handleShowProfile = () => setIsOpen(prevState => !prevState)

  const getData = async () => {
    const chatStatus = {
      active: [],
      complete: [],
      save: []
    }

    // TODO: after react-infinitive-scroll add .limitToFirst(3)
    await db.ref('chat/active/').once('value', (snapshot) => {
      chatStatus.active = snapshot.val()
    })

    await db.ref('chat/complete/').once('value', (snapshot) => {
      chatStatus.complete = snapshot.val()
    })

    await db.ref('chat/save/').once('value', (snapshot) => {
      chatStatus.save = snapshot.val()
    })

    setLengthDialogs(prevState => ({
      ...prevState,
      active: chatStatus.active.length,
      complete: chatStatus.complete.length,
      save: chatStatus.save.length
    }))

    setDialogs(chatStatus)
    setFilteredMessages(chatStatus)
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

    const filteredData = dialogs[activeTab].filter((dialog) => {
      // получить здесь массив всех сообщений из item с проверкой на включение value
      const entryValueInMessages = Object.values(dialog.messages).map((messages) => {
        return messages.content.toLowerCase().includes(value)
      }).some(e => e)

      return (
        // поиск по имени
        dialog.name.toLowerCase().includes(value) ||
        // сообщению
        entryValueInMessages
      )
    })

    setFilteredMessages(prevState => ({
      ...prevState,
      [activeTab]: filteredData
    }))
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
    setActiveDialog(e)

    if (activeDialog.index === e.index) {
      setIsOpenDialog(false)
    }
    setIsOpenDialog(true)
  }

  const fetchMoreData = async (status = 'active') => {
    // let moreStatusDialog
    // await firebase.database().ref('chat/active/').limitToFirst(lengthDialogs.active + 5).once('value', (snapshot) => {
    //   moreStatusDialog = snapshot.val()
    // })

    // setLengthDialogs(prevState => ({
    //   ...prevState,
    //   [status]: prevState[status] + 1
    // }))
    //
    // hasMore = false

    // setDialogs(prevState => [
    //   ...prevState,
    //   [status]: prevState[status].moreStatusDialog
    // ])

    // setFilteredMessages(prevState => [
    //   ...prevState,
    //   [status]: prevState[status].moreStatusDialog
    // ])
    // debugger
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

            <Tabs defaultActiveKey={activeTab} size='large' centered type='line' onChange={(e) => setActiveTab(e)}>
              {tabPanelArray.map((tabPane) => (
                <TabPane
                  tab={<span>{tabPane.componentIcon}</span>}
                  key={tabPane.status}
                >
                  <InfiniteScroll
                    dataLength={lengthDialogs.active}
                    pageStart={0}
                    loadMore={() => fetchMoreData(tabPane.status)}
                    hasMore={hasMore}
                    useWindow={false}
                    initialLoad={false}
                    // loadMore={() => fetchMoreData(tabPane.status)}
                    loader={<div className='loader' style={{ clear: 'both' }} key={0}>Loading ... </div>}
                  >
                    {/* eslint-disable-next-line array-callback-return */}
                    {filteredMessages[tabPane.status].map((message, index) => {
                      return (
                      // eslint-disable-next-line react/jsx-key
                        <>
                          <MessageItem
                            key={index}
                            avatar={message.avatar}
                            name={message.name}
                            date={message.messages[0].timestamp}
                            message={message.messages[0].content}
                            onClick={() =>
                              handlerSetActiveDialog({
                                status: 'active',
                                index,
                                message
                              })}
                          />
                        </>
                      )
                    })}
                  </InfiniteScroll>
                </TabPane>
              ))}
            </Tabs>

          </div>
          <div className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog obj={activeDialog} key={activeDialog.index} />
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
