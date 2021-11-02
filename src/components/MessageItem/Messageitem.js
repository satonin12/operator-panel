import React from 'react'

import './index.scss'

const Messageitem = ({ avatar, name, date, message }) => {
  return (
    <div className='Message'>
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
        {date}
      </div>
    </div>
  )
}

export default Messageitem
