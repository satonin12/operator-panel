import React from 'react'
import classNames from 'classnames'
import { IoIosTrash } from 'react-icons/io'

import './index.scss'

const DialogMessage = ({ isReverse, isRemovable, messages, avatar }) => {
  return (
    <div className='dialogMessage'>
      <div
        className={classNames('item', {
          reverse: isReverse,
          removable: isRemovable
        })}
      >
        <img
          src={avatar}
          className='item--avatar'
          alt='AvatarPicture'
          width={20}
          height={20}
        />
        <div className='list'>
          {messages.map((item, index) => (
            <div className='list--item' key={index}>
              <div className='item--text'>{item.message}</div>
              <div className='item--time'>{item.date}</div>
              <img
                src={item.avatar}
                className='item--message item--message__status'
                name={
                  item.status === 'sended' ? 'MessageSended' : 'MessageReaded'
                }
                alt='AvatarPicture'
                width={20}
                height={20}
              />
              <IoIosTrash
                data-id={item.id}
                size={18}
                className='item--message item--message__remove-message'
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DialogMessage
