import React from 'react'
import classNames from 'classnames'
import { IoIosTrash } from 'react-icons/io'

import './index.scss'
import Time from '../../Time/Time'

const DialogMessage = ({ isReverse, isRemovable, messages, avatar }) => {
  // console.log(messages)

  return (
    <div className='dialogMessage'>
      <div
        className={classNames('item', {
          reverse: isReverse,
          removable: isRemovable
        })}
      >
        <span>{messages.writtenBy === 'client' ? 'Клиент: ' : 'Вы: '}</span>
        <div className='list'>
          <div className='list--item'>
            <div className='item--text'>{messages.content}</div>
            <div className='item--time'>
              {/* <Time date={messages.timestamp} /> */}
            </div>
            <img
              src={avatar}
              className='item--message item--message__status'
              name={
                  messages.status === 'sended' ? 'MessageSended' : 'MessageReaded'
                }
              alt='AvatarPicture'
              width={20}
              height={20}
            />
            <IoIosTrash
              size={18}
              className='item--message item--message__remove-message'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogMessage
