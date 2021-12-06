import React from 'react'

import Time from '../Time/Time'
import classNames from 'classnames'
import Button from '../Button/Button'
import AvatarIcon from '../../img/avatar_icon.svg'

import './index.scss'

const MessageItem = ({ activeTab, messageInfo, onClick, isSelected = false, handlerTransferToSave, handlerDeleteInSave }) => {
  return (
    <li
      className={classNames('Message', {
        active: (activeTab === isSelected.tab && isSelected.id === messageInfo.uuid)
      })}
      onClick={onClick}
    >
      <div className='MessageItem MessageItem--Avatar'>
        <img
          src={messageInfo.avatar}
          className='item--avatar'
          alt='AvatarPicture'
          width={60}
          height={60}
          onError={(e) => { e.target.onerror = null; e.target.src = AvatarIcon }}
        />
      </div>
      <div className='MessageItem MessageItem--Text'>
        <div className='MessageItem MessageItem--Name'>
          {messageInfo.name}
        </div>
        <div className='MessageItem MessageItem--Message'>
          {messageInfo.messages[messageInfo.messages.length - 1].image_url > 0 ? 'Фотография' : messageInfo.messages[messageInfo.messages.length - 1].content}
        </div>
      </div>
      <div className='MessageItem MessageItem--Block'>
        <div className='MessageItem MessageItem--Time'>
          <Time date={messageInfo.messages[messageInfo.messages.length - 1].timestamp} />
        </div>
        {activeTab === 'save'
          ? (
            <div className='MessageItem MessageItem--Button'>
              <Button onClick={() => handlerDeleteInSave(messageInfo.message)}>Удалить</Button>
            </div>
            )
          : (
              activeTab !== 'start' &&
                <div className='MessageItem MessageItem--Button'>
                  <Button onClick={() => handlerTransferToSave(messageInfo.message)}>Сохранить</Button>
                </div>
            )}
      </div>
    </li>
  )
}

export default MessageItem
