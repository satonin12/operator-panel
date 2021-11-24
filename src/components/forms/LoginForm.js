import React from 'react'
import { Link } from 'react-router-dom'

import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'
import { RouteNames } from '../../router'

import VKIcon from '../../img/vk_icon.svg'
import GoogleIcon from '../../img/google_icon.svg'

import './index.scss'

const LoginForm = ({ formik, handlerClickVK, handlerClickGoogle }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='FormContent'>
          <LabelInput
            type='email'
            label='Email'
            name='email'
            placeholder=' '
            value={formik.values.email}
            onChange={formik.handleChange}
          />
          {formik.touched.email && formik.errors.email
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.email}
              </span>
              )
            : null}
          <LabelInput
            name='password'
            type='password'
            label='Пароль'
            placeholder=' '
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.password}
              </span>
              )
            : null}
          <Button type='submit' styleButton='primary'>
            Войти
          </Button>

          <div className='formLinks'>
            <div className='signVK'>
              <Link onClick={handlerClickVK} to='#'>
                <img
                  className='material-icons prefix'
                  src={VKIcon}
                  alt='VK Icon'
                  width={18}
                  height={18}
                />
                Войти через VK
              </Link>
            </div>
            <div className='signGoogle'>
              <Link onClick={handlerClickGoogle} to='#'>
                <img
                  className='material-icons prefix'
                  src={GoogleIcon}
                  alt='Google Icon'
                  width={18}
                  height={18}
                />
                Войти через Google
              </Link>
            </div>
          </div>

          <div className='formLinks'>
            <Link className='formLinks--item' to={RouteNames.REGISTER}>
              Зарегистрироваться
            </Link>

            <Link className='formLinks--item' to={RouteNames.FORGOT_PASSWORD}>
              Забыли пароль ?
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default LoginForm
