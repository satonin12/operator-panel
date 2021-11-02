import React, { useState } from 'react'

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

const HoomRoom = () => {
  const { TabPane } = Tabs

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)
  const handleShow = () => setIsOpen(true)

  return (
    <>
      <div className='MainLayout'>
        <div className='HomePage'>
          <div className='HomePage--item LeftPanel'>
            <div className='TitleBlock'>
              <div className='TitleBlock--Name'>operator@mail.ru</div>
              <div className='TitleBlock--Exit'>
                <Button styleButton='primary'>Выйти</Button>
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
                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>

                  <div className='Message'>
                    <div className='MessageItem MessageItem--Avatar'>
                      <img
                        src='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
                        className='item--avatar'
                        alt='AvatarPicture'
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className='MessageItem MessageItem--Text'>
                      <div className='MessageItem MessageItem--Name'>
                        Richards Hendrics
                      </div>
                      <div className='MessageItem MessageItem--Message'>
                        are you sure about ( lorem ipsum lorem ipsum lorem ipsum
                        ) ???
                      </div>
                    </div>
                    <div className='MessageItem MessageItem--Time'>
                      12 минут назад
                    </div>
                  </div>
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
