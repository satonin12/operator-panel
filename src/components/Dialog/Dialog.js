import React, { useState } from 'react'

import './index.scss'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Input from '../Inputs/Input/Input'
import DialogMessage from './DialogMessage/DialogMessage'
import Button from '../Button/Button'

const Dialog = (props) => {
  const message = props.obj.message
  const [value, setValue] = useState('')

  const handlerSendMessage = async () => {
    console.log(value)
  }

  return (
    <div className='Dialog'>
      <div className='Dialog--item HeaderBlock'>
        <div className='HeaderBlock--item DialogUserBlock'>
          <div className='DialogAvatar'>
            <img
              src={props.obj.message.avatar}
              alt='AvatarPicture'
              width={60}
              height={60}
            />
          </div>
          <div className='DialogName'>{props.obj.message.name}</div>
        </div>

        <div className='HeaderBlock--item'>
          <div className='HeaderBlock--search'>
            <Input placeholder='Найти сообщение' />
          </div>
        </div>
      </div>
      <div className='Dialog--item DialogContent'>
        {message.messages.map((item, index) => (
          <DialogMessage key={index} messages={item} />
        ))}
      </div>
      <div className='Dialog--item FooterBlock'>
        <div className='AnswerBlock'>
          <LabelInput label='Введите ответ' onChange={e => setValue(e.target.value)} />
          <Button onClick={handlerSendMessage}>Отправить сообщение</Button>
          <select>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default Dialog
