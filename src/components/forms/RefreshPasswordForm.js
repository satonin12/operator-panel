import React from 'react'

import Button from '../Button/Button'
import LabelInput from '../Inputs/LabelInput/LabelInput'

import './index.scss'

const RefreshPasswordForm = ({ formik }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='FormContent'>

          <LabelInput
            name='password'
            type='password'
            label='Старый пароль'
            placeholder=''
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

          <LabelInput
            name='password'
            type='password'
            label='Новый пароль'
            placeholder=''
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

          <LabelInput
            name='repeatPassword'
            type='password'
            label='Подтверждение нового пароля'
            placeholder=''
            onChange={formik.handleChange}
            value={formik.values.repeatPassword}
          />
          {formik.touched.repeatPassword && formik.errors.repeatPassword
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.repeatPassword}
              </span>
              )
            : null}

          <Button type='submit' styleButton='primary'>
            Отправить ссылку для восстановления
          </Button>
        </div>
      </form>
    </>
  )
}

export default RefreshPasswordForm
