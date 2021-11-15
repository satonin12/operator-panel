import React from 'react'

import './index.scss'
import Time from '../Time/Time'
import classNames from 'classnames'

const MessageItem = ({ activeTab, index, avatar, name, date, message, onClick, isSelected = false }) => {
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
      <div className='MessageItem MessageItem--Time'>
        <Time date={date} />
      </div>
    </div>
  )
}

export default MessageItem
