import React from 'react'
import classNames from 'classnames'

import Time from '../../Time/Time'

import './index.scss'

const DialogMessage = ({ isReverse, isRemovable, messages }) => {
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
               messages.image_url.map((item) => {
                 return (
                   // eslint-disable-next-line no-prototype-builtins
                   <div key={item.hasOwnProperty('src') ? item.src : item} className='item--image'>
                     {/* eslint-disable-next-line no-prototype-builtins */}
                     <img src={item.hasOwnProperty('src') ? item.src : item} width={300} height={300} alt='Прикрепленное изображение' />
                   </div>
                 )
               })}

            </div>

            <div className='item--time'>
              <Time date={messages.timestamp} />
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DialogMessage
