import React, { useEffect, useState } from 'react'

import { Result, Tabs } from 'antd'
import {
  HomeTwoTone,
  CheckSquareTwoTone,
  SaveTwoTone,
  SmileOutlined
} from '@ant-design/icons'
import Button from '../../components/Button/Button'

import './index.scss'
import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import Messageitem from '../../components/MessageItem/Messageitem'
import firebase from 'firebase/app'
import { useDispatch, useSelector } from 'react-redux'

const dataMessage = [
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg',
    name: 'Zachary Zachary Gray',
    message: 'Hey',
    date: '2021-11-02T13:16:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg',
    name: 'Zachary Zachary Gray',
    message: 'Hey',
    date: '2021-11-02T13:09:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg',
    name: 'Carter Kyle Ward',
    message: 'How are you?',
    date: '2021-11-02T12:19:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg',
    name: 'Adam David Perry',
    message: 'I just came from Mars',
    date: '2021-11-02T11:24:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg',
    name: 'Jayden Adrian Evans',
    message: "Hey! Everything's fine, how're you?",
    date: '2021-11-02T11:09:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg',
    name: 'Jesus Aidan Kelly',
    message: 'Ahh yes I heard',
    date: '2021-11-02T12:09:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg',
    name: 'John Jake Hughes',
    message: 'Cool',
    date: '2021-11-01T13:01:04.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg',
    name: 'Jayden Evan Robinson',
    message: 'Is the flight normal?',
    date: '2021-11-01T14:09:07.712Z'
  },
  {
    status: 'active',
    operatorId: '123',
    messages: {
      0: {
        writtenBy: 'client',
        content: 'Здравствуйте, я столкнулся с проблемой...',
        timestamp: ''
      },
      1: {
        writtenBy: 'operator',
        content: 'Здравствуйте, Иван Иваночич. Сейчас вам поможем',
        timestamp: ''
      }
    },
    avatar:
      'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg',
    name: 'Timothy Jack Harris',
    message: 'Yes, everything is cool. But do not tell anyone) ',
    date: '2021-11-01T15:09:04.712Z'
  }
]

const HoomRoom = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state)
  const { TabPane } = Tabs
  const [isOpen, setIsOpen] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
                  {dataMessage.map((message, index) => (
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
