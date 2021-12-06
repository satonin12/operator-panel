import React from 'react'

import Button from '../Button/Button'
import LabelInput from '../Inputs/LabelInput/LabelInput'

import './index.scss'
import { useSelector } from 'react-redux'

const RefreshPasswordForm = ({ formik }) => {
  const { error } = useSelector((state) => state.auth)
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='FormContent'>

          <LabelInput
            name='oldPassword'
            type='password'
            label='Старый пароль'
            placeholder=''
            onChange={formik.handleChange}
            value={formik.values.oldPassword}
          />
          {(error && formik.isSubmitting) || formik.errors.oldPassword
            ? (
              <span className='formPrompt formPrompt--error'>
                {error || formik.errors.oldPassword}
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
            Обновить пароль
          </Button>
        </div>
      </form>
    </>
  )
}

export default RefreshPasswordForm
