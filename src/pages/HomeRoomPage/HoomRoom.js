import React, { useEffect, useMemo, useState } from 'react'
import { Result, Tabs } from 'antd'
import {
  HomeTwoTone,
  CheckSquareTwoTone,
  SaveTwoTone,
  SmileOutlined,
  MailTwoTone
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

const startTabicon = <MailTwoTone twoToneColor='#f5222d' />
const activeTabIcon = <HomeTwoTone twoToneColor='#585FEB' />
const completeTabIcon = <CheckSquareTwoTone twoToneColor='#7FEB8F' />
const saveTabIcon = <SaveTwoTone twoToneColor='#EBE097' />

const tabPanelArray = [
  {
    status: 'start',
    key: 0,
    componentIcon: startTabicon,
    text: 'Очередь'
  },
  {
    status: 'active',
    key: 1,
    componentIcon: activeTabIcon,
    text: 'Активные'
  },
  {
    status: 'complete',
    key: 2,
    componentIcon: completeTabIcon,
    text: 'Завершенные'
  },
  {
    status: 'save',
    key: 3,
    componentIcon: saveTabIcon,
    text: 'Сохранённые'
  }
]

const HoomRoom = () => {
  // * Variable declaration block ======================================================================================

  const db = firebase.database()

  const hasMore = true
  const { TabPane } = Tabs
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state)

  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть окно профиля
  const [isSelected, setIsSelected] = useState({ }) // подсвечивать диалог, при его выборе
  const [dialogs, setDialogs] = useState({ active: [], complete: [], save: [], start: [] })
  const [filteredMessages, setFilteredMessages] = useState({ active: [], complete: [], save: [], start: [] }) // состояние для отфильтрованные сообщений
  // понадобится позже при пагинации диалогов
  const [lengthDialogs, setLengthDialogs] = useState({
    active: 0,
    complete: 0,
    save: 0,
    start: 0
  })

  const [activeTab, setActiveTab] = useState('start')
  const [activeDialog, setActiveDialog] = useState({})
  const [isOpenDialog, setIsOpenDialog] = useState(false) // состояние для определения открыт ли диалог или нет

  // ? Function declaration block ======================================================================================

  const getData = async () => {
    const chatStatus = {
      active: [],
      complete: [],
      save: [],
      start: []
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

    await db.ref('chat/start/').once('value', (snapshot) => {
      chatStatus.start = snapshot.val()
    })

    for (const key in chatStatus) {
      if (!Array.isArray(chatStatus[key])) {
        const wrapped = []
        for (const nestedKey in chatStatus[key]) {
          // wrapped.push(chatStatus[key][nestedKey])
          wrapped[nestedKey] = (chatStatus[key][nestedKey])
        }
        chatStatus[key] = wrapped
      }
    }

    setLengthDialogs(prevState => ({
      ...prevState,
      active: chatStatus.active.length,
      complete: chatStatus.complete.length,
      save: chatStatus.save.length,
      start: chatStatus.start.length
    }))
    setDialogs(chatStatus)
    setFilteredMessages(chatStatus)
  }

  const checkToken = async () => {
    await firebase.auth().onAuthStateChanged((user) => {
      if (user.refreshToken !== token) {
        // возвращаем пользователя на страницу авторизации с помощью setAuth = false
        dispatch({ type: 'RESET_STORE' })
      }
    })
  }

  useEffect(() => {
    checkToken()
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addDialogToActive = (dialog) => {
    // console.log(dialog)

    setActiveDialog(dialog)
    setActiveTab('active')

    setDialogs(prevState => ({
      ...prevState,
      active: [...prevState.active, dialog.message]
    }))
    setFilteredMessages(prevState => ({
      ...prevState,
      active: [...prevState.active, dialog.message]
    }))

    setLengthDialogs(prevState => ({
      ...prevState,
      active: prevState.active + 1
    }))

    // debugger
  }

  const handleShowProfile = () => setIsOpen(prevState => !prevState)

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
    console.log(e)
    setActiveDialog(e)

    if (activeTab === e.status) {
      setIsSelected({ index: e.index, tab: activeTab })
    }

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

  // ! Component render block (return) ======================================================================================
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

            <Tabs defaultActiveKey={activeTab} activeKey={activeTab} size='small' centered type='line' onChange={(e) => setActiveTab(e)}>
              {tabPanelArray.map((tabPane) => (
                <TabPane
                  tab={
                    <span>
                      {/* {tabPane.text} */}
                      {tabPane.componentIcon}
                    </span>
                  }
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
                    // loader={<div className='loader' style={{ clear: 'both' }} key={0}>Loading ... </div>}
                  >
                    {filteredMessages[tabPane.status].length === 0
                      ? <h5>Список сообщений пуст</h5>
                      : filteredMessages[tabPane.status].map((message, index) => (
                        <MessageItem
                          key={index}
                          index={index}
                          avatar={message.avatar}
                          name={message.name}
                          date={message.messages[0].timestamp}
                          message={message.messages[0].content}
                          isSelected={isSelected}
                          activeTab={activeTab}
                          onClick={() =>
                            handlerSetActiveDialog({
                              status: tabPane.status,
                              index,
                              message
                            })}
                        />
                      ))}
                  </InfiniteScroll>
                </TabPane>
              ))}
            </Tabs>

          </div>
          <div className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog obj={activeDialog} key={activeDialog.index} transferToActive={addDialogToActive} />
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
