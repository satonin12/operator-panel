import React from 'react'

import './index.scss'
import Time from '../Time/Time'
import classNames from 'classnames'
import Button from '../Button/Button'

const MessageItem = ({ activeTab, index, avatar, name, date, message, onClick, isSelected = false, handlerButton }) => {
  return (
    <div
      className={classNames('Message', {
        active: (activeTab === isSelected.tab && isSelected.index === index)
        // active: isSelected === index
      })}
      onClick={onClick}
    >
      <div className='MessageItem MessageItem--Avatar'>
        <img
          src={avatar}
          className='item--avatar'
          alt='AvatarPicture'
          width={60}
          height={60}
        />
      </div>
      <div className='MessageItem MessageItem--Text'>
        <div className='MessageItem MessageItem--Name'>
          {name}
        </div>
        <div className='MessageItem MessageItem--Message'>
          {message}
        </div>
      </div>
      <div className='MessageItem MessageItem--Block'>
        <div className='MessageItem MessageItem--Time'>
          <Time date={date} />
        </div>
        {activeTab === 'save'
          ? (
            <div className='MessageItem MessageItem--Button'>
              <Button>Удалить</Button>
            </div>
            )
          : (
              activeTab !== 'start' &&
                <div className='MessageItem MessageItem--Button'>
                  <Button onClick={() => handlerButton(message)}>Сохранить</Button>
                </div>
            )}
      </div>
    </div>
  )
}

export default MessageItem
