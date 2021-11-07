import React, { useEffect, useState } from 'react'
import { Result, Tabs } from 'antd'
import {
  HomeTwoTone,
  CheckSquareTwoTone,
  SaveTwoTone,
  SmileOutlined
} from '@ant-design/icons'
import firebase from 'firebase/app'
import { useDispatch, useSelector } from 'react-redux'

import Button from '../../components/Button/Button'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Messageitem from '../../components/MessageItem/Messageitem'
import dataMesage from '../../utils/dataMessage.json'

import './index.scss'

const HoomRoom = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state)
  const { TabPane } = Tabs
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const initialDataMessage = dataMesage

  const handleClose = () => setIsOpen(false)
  const handleShow = () => setIsOpen(true)

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

    try {
      setTimeout(async () => {
        const responce = await dataMesage
        const mockData = responce

        if (mockData) {
          setMessages(mockData)
          // TODO: в будущем dispatch
        }
      }, 1000)
    } catch (e) {
      console.log(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlerSearch = (e) => {
    const value = e.target.value.toLowerCase()
    if (value === '') {
      setMessages(initialDataMessage)
      return
    }
    // поиск по имени, сообщению
    const filteredData = messages.filter((item) => {
      return (
        item.name.toLowerCase().includes(value) ||
        item.message.toLowerCase().includes(value)
      )
    })
    setMessages(filteredData)
  }

  const handlerExit = () => {
    const answer = window.confirm('Вы точно хотите выйти ?')
    if (answer) dispatch({ type: 'RESET_STORE' })
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
                  onChange={handlerSearch}
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
                  {messages.map((message, index) => (
                    <Messageitem
                      key={index + message.name}
                      avatar={message.avatar}
                      name={message.name}
                      date={message.date}
                      message={message.message}
                    />
                  ))}
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
                <div className='LeftPanel__Completed'>2</div>
              </TabPane>

              <TabPane
                tab={
                  <span>
                    <SaveTwoTone twoToneColor='#EBE097' />
                  </span>
                }
                key='3'
              >
                <div className='LeftPanel__Saved'>3</div>
              </TabPane>
            </Tabs>
          </div>
          <div className='HomePage--item MainPanel'>
            <Result
              icon={<SmileOutlined />}
              title='Выберите диалог чтобы начать!'
              extra={<Button onClick={handleShow}>Открыть окно профиля</Button>}
            />
          </div>
          <div className='HomePage--item RightPanel'>
            <Offcanvas
              backdrop={false}
              fade={false}
              direction='end'
              isOpen={isOpen}
              onEnter={handleClose}
              onExit={handleClose}
              toggle={handleClose}
            >
              <OffcanvasHeader toggle={handleClose}>
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
