import React, { useEffect, useMemo, useState } from 'react'
import { Result, Tabs } from 'antd'
import {
  HomeTwoTone,
  CheckSquareTwoTone,
  SaveTwoTone,
  SmileOutlined,
  MailTwoTone
} from '@ant-design/icons'
import firebase from 'firebase'
// import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import { useDispatch, useSelector } from 'react-redux'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'

import InfiniteScroll from 'react-infinite-scroll-component'
import Button from '../../components/Button/Button'
import Dialog from '../../components/Dialog/Dialog'
import MessageItem from '../../components/MessageItem/MessageItem'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'

import './index.scss'

const startTabIcon = <MailTwoTone twoToneColor='#f5222d' />
const activeTabIcon = <HomeTwoTone twoToneColor='#585FEB' />
const completeTabIcon = <CheckSquareTwoTone twoToneColor='#7FEB8F' />
const saveTabIcon = <SaveTwoTone twoToneColor='#EBE097' />

const tabPanelArray = [
  {
    status: 'start',
    key: 0,
    componentIcon: startTabIcon,
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

  let clicked = '' // отслеживаем куда именно нажал пользователь в компоненту MessageItem (на сам диалог или кнопку "Сохранить"/"Удалить")
  const hasMore = true
  const { TabPane } = Tabs

  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)
  const { dialogs, filteredMessages, lengthDialogs } = useSelector((state) => state.dialog)

  // нижние 5 состояния не сохраняем в dispatch т.к не хотим чтобы диалоги и вкладки оставались открытыми, они будут открыватся по умолчанию
  // ! они есть в dispatch так что при желании их можно будет оставлять открытыми даже после перезагрузки
  const [isOpen, setIsOpen] = useState(false) // открыть-закрыть окно профиля
  const [isSelected, setIsSelected] = useState({}) // подсвечивать диалог, при его выборе
  const [activeTab, setActiveTab] = useState('start')
  const [activeDialog, setActiveDialog] = useState({})
  const [isOpenDialog, setIsOpenDialog] = useState(false) // состояние для определения открыт ли диалог или нет

  // ? Function declaration block ======================================================================================

  const getData = () => { dispatch({ type: 'GET_DIALOGS_REQUEST' }) }

  const checkToken = async () => {
    try {
      await firebase.auth().onAuthStateChanged((user) => {
        if (user.refreshToken !== token) {
          // возвращаем пользователя на страницу авторизации с помощью setAuth = false
          dispatch({ type: 'RESET_STORE' })
        }
      })
    } catch (e) {
      console.log(e)
      throw Error('Ошибка в проверке токена: ' + e)
    }
  }

  // TODO: объеденить в одну функцию с checkDialogOperatorId из Dialog.js
  // TODO: в текущей версии не используется
  // eslint-disable-next-line no-unused-vars
  const transferDialog = async ({ status, index, dialog }) => {
    const newObject = {
      ...dialog,
      status: 'save'
    }
    // переводим диалог в сохранненые
    // (средствами realtime database firebase) - это означает удалить данную запись полностью и создать новую в путе chat/save/${LastIndex} + 1 с новым status
    let lengthSaveDialogs = null
    // создаем запись
    // для этого узнаем длину последнего элемента в сохраненных чатах
    await firebase
      .database()
      .ref('chat/save/')
      .limitToLast(1)
      .once('value', (snapshot) => {
        lengthSaveDialogs = Number(Object.keys(snapshot.val())[0]) + 1
      })

    if (lengthSaveDialogs) {
      // TODO: id оператора брать из контекста после входа
      await firebase
        .database()
        .ref(`chat/save/${lengthSaveDialogs}`)
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

    const newObjectFromDialogs = {
      index: lengthSaveDialogs,
      message: newObject,
      status: 'save'
    }
    // ! удаляем запись из активных
    // await firebase
    //   .database()
    //   .ref(`chat/${status}/${index}`)
    //   .remove((error) => {
    //     console.log(error)
    //     console.log('вроде как удалили - смотри firebase')
    //   })
    //  после всего этого нужно перерендерить компонент homepage, чтобы текущий диалог встал в карточку 'active'
    //  для этого вручную кладём текущий dialogItem в массив active
    addDialogToSave(newObjectFromDialogs)
  }

  useEffect(() => {
    checkToken()
    getData()
    // eslint-disable-next-line
  }, [])

  // TODO: объеденить в одну функцию нижние две
  const addDialogToActive = (dialog) => {
    setActiveTab('active')
    setActiveDialog(dialog)
    dispatch({ type: 'ADD_DIALOG_TO_ACTIVE', payload: dialog.message })
    setIsSelected({ index: dialog.index, tab: 'active' })
  }

  // eslint-disable-next-line no-unused-vars
  const addDialogToSave = (dialog) => {
    setActiveTab('save')
    setActiveDialog(dialog)
    setIsSelected({ index: dialog.index, tab: 'save' })
  }

  // TODO: обернуть в useCallback
  const transferDialogToSave = (obj) => {
    clicked = 'Button'
    // добавляем индекс где стоял элемент раньше
    obj.dialog.indexBefore = obj.index
    dispatch({ type: 'ADD_TO_SAVE', payload: obj })
    // TODO: пока что не используется, понадобится если будет сохранять вкладку save в firebase
    // transferDialog(obj) // переводим диалог в сохраненные
  }

  const removeDialogFromSave = (obj) => {
    dispatch({ type: 'DELETE_FROM_SAVE', payload: obj })
  }

  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase()

    const filteredData = dialogs[activeTab].filter((dialog) => {
      // получить здесь массив всех сообщений из item с проверкой на включение value
      const entryValueInMessages = Object.values(dialog.messages)
        .map((messages) => {
          return messages.content.toLowerCase().includes(value)
        })
        .some((e) => e)

      return (
        // поиск по имени
        dialog.name.toLowerCase().includes(value) ||
        // сообщению
        entryValueInMessages
      )
    })

    dispatch({
      type: 'SET_FILTERED_DIALOGS',
      payload: {
        tab: activeTab,
        dialogs: filteredData
      }
    })
  }

  /* Различия использования между debounce & throttle
   * Наша функцию debouncedHandlerSearch вызовется несколько раз, но она вызовет функцию handleSearch лишь раз после того, как закончится wait, который мы передаем вторым параметром debounce -> (_, wait: 300)
   * её будем использовать для поиска необходимого нам сообщения, дабы не фильтровать сообщения каждый раз при вводе её пользователем
   *
   * Функцию throttledHandlerSearch используем для связи с сервером т.к. она вызовется не более чем одного раза в заданное время ожидания (пока что не требуется)
   *
   * обе функции требуют, чтобы отлаженная функия должна оставаться неизменной -> для этого оборачиваем в useMemo
   */

  // eslint-disable-next-line
  const debouncedHandlerSearch = useMemo(() => {
    return debounce(handlerSearch, 500)
  })

  // const throttledHandlerSearch = useMemo(() => {
  //   return throttle(handlerSearch, 300)
  // })

  const handlerExit = () => {
    const answer = window.confirm('Вы точно хотите выйти ?')
    if (answer) {
      // TODO: добавить общий сброс store
      dispatch({ type: 'RESET_STORE' })
      dispatch({ type: 'RESET_DIALOGS_STORE' })
    }
  }

  // TODO: поправить баг при клике на тот же диалог
  const handlerSetActiveDialog = (e) => {
    if (clicked !== 'Button') {
      setActiveDialog(e)
      setIsOpenDialog(true)
      setIsSelected({ index: e.index, tab: activeTab })
    }
    // reset
    clicked = ''
  }

  // TODO: пока что не используется, нужно большге времени чтобы правильно настроить пагинацию и react-infinitive-scroll
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
  }

  // ! Component render block (return) ======================================================================================
  return (
    <>
      <div className='MainLayout'>
        <div className='HomePage'>
          <div className='HomePage--item LeftPanel'>
            <div className='TitleBlock'>
              <div className='TitleBlock--Name'>{user.email}</div>
              <div className='TitleBlock--Exit'>
                <Button styleButton='primary' onClick={handlerExit}>
                  Выйти
                </Button>
              </div>
            </div>
            <div className='SearchBlock'>
              <div className='SearchBlock--Search'>
                <LabelInput
                  label='Search here ...'
                  name='searchUser'
                  type='text'
                  placeholder=' '
                  onChange={debouncedHandlerSearch}
                />
              </div>
            </div>

            <Tabs
              defaultActiveKey={activeTab}
              activeKey={activeTab}
              size='small'
              centered
              type='line'
              onChange={(e) => setActiveTab(e)}
            >
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
                  >
                    <h5>{tabPane.text}</h5>
                  </InfiniteScroll>
                  {filteredMessages[tabPane.status].length === 0
                    ? (
                      <p>Список сообщений пуст</p>
                      )
                    : (
                      // eslint-disable-next-line array-callback-return
                        filteredMessages[tabPane.status].map((message, index) => {
                          if (message !== null && typeof message !== 'undefined') {
                            return (
                              <MessageItem
                                key={index}
                                index={index}
                                avatar={message.avatar}
                                name={message.name}
                                date={message.messages[message.messages.length - 1].timestamp}
                                message={message.messages[message.messages.length - 1].content}
                                isSelected={isSelected}
                                activeTab={activeTab}
                                handlerTransferToSave={() =>
                                  transferDialogToSave({ status: tabPane.status, index, dialog: message })}
                                handlerDeleteInSave={() =>
                                  removeDialogFromSave({ status: tabPane.status, index, dialog: message })}
                                onClick={() =>
                                  handlerSetActiveDialog({
                                    status: message.status,
                                    index,
                                    message
                                  })}
                              />
                            )
                          }
                        })
                      )}
                </TabPane>
              ))}
            </Tabs>
          </div>
          <div className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog
                  obj={activeDialog}
                  key={activeDialog.index}
                  indexKey={activeDialog.index}
                  transferToActive={addDialogToActive}
                />
                )
              : (
                <Result
                  icon={<SmileOutlined />}
                  title='Выберите диалог чтобы начать!'
                  extra={
                    <Button onClick={() => setIsOpen((prevState) => !prevState)}>
                      Открыть окно профиля
                    </Button>
                }
                />
                )}
          </div>
          <div className='HomePage--item RightPanel'>
            <Offcanvas
              backdrop={false}
              fade={false}
              direction='end'
              isOpen={isOpen}
              toggle={() => setIsOpen((prevState) => !prevState)}
            >
              <OffcanvasHeader toggle={() => setIsOpen((prevState) => !prevState)}>
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
