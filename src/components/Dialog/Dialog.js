import React from 'react'

import './index.scss'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Input from '../Inputs/Input/Input'
import DialogMessage from './DialogMessage/DialogMessage'

const messages = [
  {
    message: 'Привет',
    avatar: 'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
  },
  {
    message: 'Как дела?',
    avatar: 'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
  },
  {
    message: 'Я только приехал с Марса',
    avatar: 'https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg'
  },
  {
    message: 'Привет! Все хорошо, ты как?',
    avatar: 'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg'
  },
  {
    message: 'Ааа, да, я слышал',
    avatar: 'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg'
  },
  {
    message: 'Круто',
    avatar: 'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg'
  },
  {
    message: 'Полет нормальный?',
    avatar: 'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg'
  },
  {
    message: 'Да, все круто. Только никому не говори)',
    avatar: 'https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg'
  }
]

const Dialog = () => {
  return (
    <div className='Dialog'>
      <div className='Dialog--item HeaderBlock'>
        <div className='HeaderBlock--item DialogName'>Elizabeth Turner</div>
        <div className='HeaderBlock--item'>
          <div className='HeaderBlock--search'>
            <Input placeholder='Найти сообщение' />
          </div>
        </div>
      </div>
      <div className='Dialog--item DialogContent'>
        <DialogMessage avatar='https://sun9-2.userapi.com/c638729/v638729951/1d0ea/f9V7aJyh6tw.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
        <DialogMessage avatar='https://sun9-58.userapi.com/c836638/v836638514/867c/SPMigNB8gw0.jpg' messages={messages} />
      </div>
      <div className='Dialog--item FooterBlock'>
        <div className='AnswerBlock'>
          <LabelInput label='Введите ответ' />
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
