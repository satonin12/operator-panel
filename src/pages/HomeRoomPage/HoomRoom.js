import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { Result, Tabs, Menu, Dropdown, Badge, Spin } from 'antd'
import {
  MailFilled,
  HomeTwoTone,
  SaveTwoTone,
  MailTwoTone,
  PhoneFilled,
  SmileOutlined,
  CloseOutlined,
  EllipsisOutlined,
  EnvironmentFilled,
  CheckSquareTwoTone
} from '@ant-design/icons'
import { useFormik } from 'formik'
import ReactModal from 'react-modal'
// import throttle from 'lodash.throttle'
import debounce from 'lodash.debounce'
import { useDispatch, useSelector } from 'react-redux'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'

// TODO: добавить index.js в папку components чтобы испортировать необходимые компоненты как обьекты 1 импортом
import Button from '../../components/Button/Button'
import Dialog from '../../components/Dialog/Dialog'
import { UpdatePasswordSchema } from '../../utils/validation'
import UpdateProfile from '../../components/forms/UpdateProfile'
import MessageItem from '../../components/MessageItem/MessageItem'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import RefreshPasswordForm from '../../components/forms/RefreshPasswordForm'
import SettingsDialog from '../../components/forms/SettingsDialog'

import './index.scss'

const HoomRoom = () => {
  // * Variable declaration block ======================================================================================

  const clicked = '' // отслеживаем куда именно нажал пользователь в компоненту MessageItem (на сам диалог или кнопку "Сохранить"/"Удалить")
  const clickedRef = useRef(clicked) // оптимизируем для использования в useCallback
  const hasMore = true
  const { TabPane } = Tabs
  const messagesEndRef = useRef(null) // при переводе диалога в активный, отматываем его к этому диалогу

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { dialogs, filteredMessages, lengthDialogs, loadingData } = useSelector((state) => state.dialog)

  const formikUpdateProfile = useFormik({
    initialValues: {
      name: user.name || '',
      avatarUrl: user.avatar || ''
    },
    // validationSchema: UpdatePasswordSchema,
    onSubmit: (values) => {
      dispatch(
        {
          type: 'CHANGE_USER_FIELD',
          payload: {
            name: values.name
          }
        }
      )
      dispatch(
        {
          type: 'CHANGE_USER_FIELD',
          payload: {
            avatar: values.avatarUrl
          }
        }
      )
      handlerModalExit()
    }
  })
  const formikRefreshPassword = useFormik({
    initialValues: {
      oldPassword: '',
      password: '',
      repeatPassword: ''
    },
    validationSchema: UpdatePasswordSchema,
    onSubmit: (values) => {
      dispatch({
        type: 'REFRESH_PASSWORD',
        payload: {
          user: {
            ...values
          }
        }
      })
    }
  })
  const formikUpdateSettingsDialog = useFormik({
    initialValues: {
      autoGreeting: user.autoGreeting || '',
      readyPhrases: user.readyPhrases || []
    },
    onSubmit: (values) => {
      // UPDATE_DIALOG_SETTINGS - this is authAction,
      // because all settings operators kept on operator's id firebase data
      dispatch({
        type: 'CHANGE_USER_FIELD',
        payload: {
          autoGreeting: values.autoGreeting
        }
      })
      dispatch({
        type: 'CHANGE_USER_FIELD',
        payload: {
          readyPhrases: values.readyPhrases
        }
      })
      handlerModalExit()
    }
  })

  // состояния ниже не сохраняем в redux т.к не хотим чтобы диалоги и вкладки оставались открытыми, они будут открыватся по умолчанию
  // ! NOTICE: они есть в action's, так что при желании их можно будет оставлять открытыми даже после перезагрузки
  const [isOpen, setIsOpen] = useState(false) // открыть/закрыть окно профиля
  const [isSelected, setIsSelected] = useState({}) // подсвечивать диалог, при его выборе
  const [activeTab, setActiveTab] = useState('start')
  const [activeDialog, setActiveDialog] = useState({})
  const [isOpenDialog, setIsOpenDialog] = useState(false) // состояние для определения открыт ли диалог или нет
  const [dropDownMenu, setDropDownMenu] = useState({
    showModal: false,
    menuClick: ''
  })

  // ? Function declaration block ======================================================================================

  const checkToken = () => { dispatch({ type: 'CHECK_TOKEN' }) }

  const getData = () => { dispatch({ type: 'GET_DIALOGS_REQUEST' }) }

  const sortDialogs = () => {
    const objectKeys = Object.keys(filteredMessages)
    objectKeys.map((item) => (
      filteredMessages[item].length > 1
        // eslint-disable-next-line array-callback-return
        ? filteredMessages[item].sort((a, b) => {
            if (a !== null && b !== null) {
              const a1 = a.messages[a.messages.length - 1].timestamp
              const b1 = b.messages[b.messages.length - 1].timestamp
              return (a1.date < b1.date) ? -1 : ((a1.date > b1.date) ? 1 : 0)
            }
          })
        : null
    ))
  }

  useEffect(() => {
    checkToken()
    getData()
    sortDialogs()
    clickedRef.current = clicked
    // eslint-disable-next-line
  }, [])

  // Когда оператор выбрал диалог из очереди -> то переводим его в активный этому оператору
  const transferDialogToActive = (dialog) => {
    setActiveTab('active')
    setActiveDialog(prevState => ({
      ...prevState,
      ...dialog
    }))
    setIsSelected(prevState => ({
      ...prevState,
      index: dialog.index,
      tab: 'active'
    }))
    dispatch({ type: 'ADD_DIALOG_TO_ACTIVE', payload: dialog.message })
    scrollToBottom()
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
      dispatch({ type: 'RESET_REDUX' })
    }
  }

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
    setIsOpen(prevState => !prevState)
  }

  const handleOpenModal = (e) => {
    setDropDownMenu(prevState => ({
      ...prevState,
      showModal: true,
      menuClick: e.key
    }))
  }

  const handlerModalExit = () => {
    setDropDownMenu(prevState => ({
      ...prevState,
      showModal: false,
      menuClick: ''
    }))
  }

  // TODO: пока что не используется, нужно большге времени чтобы правильно настроить пагинацию и react-infinitive-scroll
  /* const fetchMoreData = useCallback(async (status = 'active') => {
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
  // }, [])
   */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // * JSX Variable declaration block ============================

  const menu = (
    <Menu>
      <Menu.ItemGroup title='Настройки'>
        <Menu.Item key='profile' onClick={handleOpenModal}>Настройки профиля</Menu.Item>
        <Menu.Item key='password' onClick={handleOpenModal}>Настройки пароля</Menu.Item>
        <Menu.Item key='dialog' onClick={handleOpenModal}>Настройки диалога</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  )

  const startTabIcon = <MailTwoTone twoToneColor='#f5222d' />
  const activeTabIcon = <HomeTwoTone twoToneColor='#585FEB' />
  const completeTabIcon = <CheckSquareTwoTone twoToneColor='#7FEB8F' />
  const saveTabIcon = <SaveTwoTone twoToneColor='#eb2f96' />

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
      color: '#eb2f96'
    }
  ]

  // ! Component render block (return) ======================================================================================
  return (
    <>
      <div className='MainLayout'>
        <div className='HomePage'>
          <div className='HomePage--item LeftPanel'>

            <div className='TitleBlock'>
              <div className='TitleBlock--Operator'>
                <div className='TitleBlock--Avatar'>
                  <img
                    src={user.avatar}
                    alt='Avatar operator'
                    width={40}
                    height={40}
                  />
                </div>
                <div className='TitleBlock--Name'>{user.name !== '' ? user.name : user.email}</div>
              </div>
              <div className='BlockButtons'>
                <div className='BlockButtons--Item BlockButtons--Exit'>
                  <Button styleButton='primary' onClick={handlerExit}>
                    Выйти
                  </Button>
                </div>
                <div className='BlockButtons--Item BlockButtons--Etc'>
                  <Dropdown overlay={menu}>
                    <a href='/#' className='ant-dropdown-link' onClick={e => e.preventDefault()}>
                      <EllipsisOutlined />
                    </a>
                  </Dropdown>
                </div>
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

            {loadingData
              ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '50px'
                  }}
                >
                  <Spin
                    tip='Loading...'
                    size='large'
                  />
                </div>
                )
              : (
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
                            <Badge showZero count={lengthDialogs[tabPane.status]} color={tabPane.color} size='small'>
                              {tabPane.componentIcon}
                            </Badge>
                          </div>
                        </span>
                      }
                      key={tabPane.status}
                    >
                      <InfiniteScroll
                        pageStart={0}
                        hasMore={hasMore}
                        useWindow={false}
                        initialLoad={false}
                        dataLength={lengthDialogs.active}
                        // loadMore={() => fetchMoreData(tabPane.status)}
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
                                if (message !== null && typeof message !== 'undefined') {
                                  return (
                                    <MessageItem
                                      key={index}
                                      index={index}
                                      name={message.name}
                                      activeTab={activeTab}
                                      avatar={message.avatar}
                                      isSelected={isSelected}
                                      date={message.messages[message.messages.length - 1].timestamp}
                                      message={message.messages[message.messages.length - 1].content}
                                      image={message.messages[message.messages.length - 1].image_url}
                                      onClick={() => handlerSetActiveDialog({ status: message.status, index, message })}
                                      handlerDeleteInSave={() => removeDialogFromSave({ status: tabPane.status, index, dialog: message })}
                                      handlerTransferToSave={() => transferDialogToSave({ status: tabPane.status, index, dialog: message })}
                                    />
                                  )
                                }
                              })
                            )}
                        <div ref={messagesEndRef} />
                      </ul>
                    </TabPane>
                  ))}
                </Tabs>
                )}

          </div>
          <main className='HomePage--item MainPanel'>
            {isOpenDialog
              ? (
                <Dialog
                  key={activeDialog.index}
                  dialogData={activeDialog}
                  handlerOpenProfile={handlerOpenProfile}
                  transferToActive={transferDialogToActive}
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

          <ReactModal
            isOpen={dropDownMenu.showModal}
            ariaHideApp={false}
            style={{
              overlay: {
                backgroundColor: 'papayawhip',
                top: '20%',
                left: '30%',
                right: 'auto',
                bottom: 'auto',
                marginRight: '-50%',
                transform: 'translate(-50%, -50%)'
              },
              content: {
                color: 'lightsteelblue',
                width: '600px',
                height: 'fit-content'
              }
            }}
            contentLabel='Inline Styles Modal Example'
          >
            {dropDownMenu.menuClick === 'profile'
              ? (
            // TODO: вынести modal в отдельный компонент
                <div className='Modal'>
                  <div className='Modal--Title'>
                    <h3 className='Title--Center'>Обновить профиль</h3>
                    <span className='Modal--Close' onClick={handlerModalExit}><CloseOutlined /></span>
                  </div>

                  <UpdateProfile formik={formikUpdateProfile} />
                </div>
                )
              : (
                  dropDownMenu.menuClick === 'password'
                    // eslint-disable-next-line multiline-ternary
                    ? (
                      <div className='Modal'>
                        <div className='Modal--Title'>
                          <h3 className='Title--Center'>Обновить пароль</h3>
                          <span className='Modal--Close' onClick={handlerModalExit}><CloseOutlined /></span>
                        </div>

                        <RefreshPasswordForm formik={formikRefreshPassword} />
                      </div>
                      ) : (
                        <div className='Modal'>
                          <div className='Modal--Title'>
                            <h3 className='Title--Center'>Обновить настройки диалога</h3>
                            <span className='Modal--Close' onClick={handlerModalExit}><CloseOutlined /></span>
                          </div>

                          <SettingsDialog formik={formikUpdateSettingsDialog} />
                        </div>
                      )
                )}

          </ReactModal>
        </div>
      </div>
    </>
  )
}

export default HoomRoom
