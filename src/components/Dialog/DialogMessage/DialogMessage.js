import React from 'react'
import classNames from 'classnames'

import Time from '../../Time/Time'

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
        <span>{messages.writtenBy === 'client' ? 'Клиент: ' : 'Вы: '}</span>
        <div className={classNames('list', {
          operator: (messages.writtenBy === 'operator')
        })}
        >
          <div className='list--item'>
            <div className='item--BlockMessage'>
              <div className='item--text'>{messages.content}</div>

              {typeof messages.image_url !== 'undefined' && messages.image_url?.length > 0 &&
               messages.image_url.map((item, index) => (
                 <div key={index} className='item--image'>
                   <img src={item.src} width={300} height={300} alt='Image' />
                 </div>
               ))}

            </div>

            <div className='item--time'>
              <Time date={messages.timestamp} />
            </div>

            {/* <img */}
            {/*  src={avatar} */}
            {/*  className='item--message item--message__status' */}
            {/*  name={ */}
            {/*      messages.status === 'sended' ? 'MessageSended' : 'MessageReaded' */}
            {/*    } */}
            {/*  alt='AvatarPicture' */}
            {/*  width={20} */}
            {/*  height={20} */}
            {/* /> */}
            {/* <IoIosTrash */}
            {/*  size={18} */}
            {/*  className='item--message item--message__remove-message' */}
            {/* /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogMessage
