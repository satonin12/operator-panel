import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Result, Tabs } from 'antd'
import {
  MailFilled,
  HomeTwoTone,
  SaveTwoTone,
  MailTwoTone,
  PhoneFilled,
  SmileOutlined,
  EnvironmentFilled,
  CheckSquareTwoTone
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
    text: 'Очередь',
    color: '#f5222d'
  },
  {
    status: 'active',
    key: 1,
    componentIcon: activeTabIcon,
    text: 'Активные',
    color: '#585FEB'
  },
  {
    status: 'complete',
    key: 2,
    componentIcon: completeTabIcon,
    text: 'Завершенные',
    color: '#7FEB8F'
  },
  {
    status: 'save',
    key: 3,
    componentIcon: saveTabIcon,
    text: 'Сохранённые',
    color: '#EBE097'
  }
]

const HoomRoom = () => {
  // * Variable declaration block ======================================================================================

  const clicked = '' // отслеживаем куда именно нажал пользователь в компоненту MessageItem (на сам диалог или кнопку "Сохранить"/"Удалить")
  const clickedRef = useRef(clicked) // оптимизируем для использования в useCallback
  let previewMessageOnDb = null
  const hasMore = true
  const { TabPane } = Tabs

  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.auth)
  const { dialogs, filteredMessages, lengthDialogs } = useSelector((state) => state.dialog)
  const { messages, idDialogUser } = useSelector((state) => state.message)

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
            console.log('Добавление прошло удачно - смотри firebase')
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

  const sortDialogs = () => {
    const objectKeys = Object.keys(filteredMessages)
    // eslint-disable-next-line array-callback-return
    objectKeys.map((item) => {
      if (filteredMessages[item].length > 1) {
        // eslint-disable-next-line array-callback-return
        filteredMessages[item].sort((a, b) => {
          if (a !== null && b !== null) {
            const a1 = a.messages[a.messages.length - 1].timestamp
            const b1 = b.messages[b.messages.length - 1].timestamp
            return (a1.date < b1.date) ? -1 : ((a1.date > b1.date) ? 1 : 0)
          }
        })
      }
    })
  }

  useEffect(() => {
    checkToken()
    getData()
    sortDialogs()
    clickedRef.current = clicked
    // eslint-disable-next-line
  }, [])

  // TODO: нужен для сортировки сообщений после того как что-то написали в диалогах
  // useEffect(() => {
  //   sortDialogs()
  //   // eslint-disable-next-line
  // }, [messages])

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

  const transferDialogToSave = useCallback((obj) => {
    clickedRef.current = 'Button'

    // добавляем индекс где стоял элемент раньше
    obj.dialog.indexBefore = obj.index
    dispatch({ type: 'ADD_TO_SAVE', payload: obj })

    // TODO: пока что не используется, понадобится если будет сохранять вкладку save в firebase
    // transferDialog(obj) // переводим диалог в сохраненные
  }, [dispatch])

  const removeDialogFromSave = useCallback((obj) => {
    dispatch({ type: 'DELETE_FROM_SAVE', payload: obj })
  }, [dispatch])

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
      dispatch({ type: 'RESET_MESSAGE_STORE' })
    }
  }

  // TODO: поправить баг при клике на тот же диалог
  const handlerSetActiveDialog = useCallback((e) => {
    if (clickedRef.current !== 'Button') {
      setActiveDialog(e)
      setIsOpenDialog(true)
      setIsSelected({ index: e.index, tab: activeTab })
    }
    // reset
    clickedRef.current = ''
  }, [activeTab])

  const handlerOpenProfile = () => {
    console.log('открыли профиль')
    setIsOpen(prevState => !prevState)
  }

  // TODO: пока что не используется, нужно большге времени чтобы правильно настроить пагинацию и react-infinitive-scroll
  const fetchMoreData = useCallback(async (status = 'active') => {
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
  }, [])

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
                      <div>
                        {tabPane.componentIcon}
                        <div style={{
                          position: 'absolute',
                          top: '17%',
                          left: '-42%',
                          borderRadius: '50%',
                          height: '17px',
                          width: '17px',
                          fontSize: '12px',
                          opacity: '84%',
                          zIndex: 1,
                          backgroundColor: tabPane.color,
                          color: 'black',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        >{lengthDialogs[tabPane.status]}
                        </div>
                      </div>
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
                  <ul>
                    {filteredMessages[tabPane.status].length === 0
                      ? (
                        <li>Список сообщений пуст</li>
                        )
                      : (
                        // eslint-disable-next-line array-callback-return
                          filteredMessages[tabPane.status].map((message, index) => {
                            previewMessageOnDb = true
                            if (message !== null && typeof message !== 'undefined') {
                              if (message.uuid === idDialogUser) previewMessageOnDb = false
                              return (
                                <MessageItem
                                  key={index}
                                  index={index}
                                  name={message.name}
                                  activeTab={activeTab}
                                  avatar={message.avatar}
                                  isSelected={isSelected}
                                  onClick={() => handlerSetActiveDialog({ status: message.status, index, message })}
                                  handlerDeleteInSave={() => removeDialogFromSave({ status: tabPane.status, index, dialog: message })}
                                  handlerTransferToSave={() => transferDialogToSave({ status: tabPane.status, index, dialog: message })}
                                  message={previewMessageOnDb ? message.messages[message.messages.length - 1].content : messages[messages.length - 1].content}
                                  date={previewMessageOnDb ? message.messages[message.messages.length - 1].timestamp : messages[messages.length - 1].timestamp}
                                />
                              )
                            }
                          })
                        )}
                  </ul>
                </TabPane>
              ))}
            </Tabs>
          </div>
          <main className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog
                  obj={activeDialog}
                  key={activeDialog.index}
                  indexKey={activeDialog.index}
                  transferToActive={addDialogToActive}
                  handlerOpenProfile={handlerOpenProfile}
                />
                )
              : (
                <Result
                  icon={<SmileOutlined />}
                  title='Выберите диалог чтобы начать!'
                />
                )}
          </main>
          <aside className='HomePage--item RightPanel'>
            <Offcanvas
              fade={false}
              direction='end'
              isOpen={isOpen}
              backdrop={false}
              toggle={() => setIsOpen((prevState) => !prevState)}
            >
              <div className='AboutBlock'>
                <img className='AboutBlock--Avatar' src={activeDialog.message?.avatar} alt='Аватар профиля' width={150} height={150} />
                <OffcanvasHeader toggle={() => setIsOpen((prevState) => !prevState)}>
                  <h4 className='AboutBlock--Title'>{activeDialog.message?.name}</h4>
                  <p className='AboutBlock--Text'>Москва, Набережная 28</p>
                </OffcanvasHeader>
                <OffcanvasBody>
                  <div className='AboutBlock--Info Info'>
                    <div className='Info--item'>
                      <span className='Info--Badge'><EnvironmentFilled /></span>
                      Москва, Пезанская башня 38
                    </div>
                    <div className='Info--item'>
                      <span className='Info--Badge'><PhoneFilled /></span>
                      8-999-999-99-99
                    </div>
                    <div className='Info--item'>
                      <span className='Info--Badge'><MailFilled /></span>
                      test@mail.ru
                    </div>
                  </div>
                </OffcanvasBody>
              </div>
            </Offcanvas>
          </aside>
        </div>
      </div>
    </>
  )
}

export default HoomRoom
