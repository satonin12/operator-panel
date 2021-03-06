import React from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import LoginForm from '../../components/forms/LoginForm'
import { LoginSchema } from '../../utils/validation'

import './index.scss'
import BaseLayouts from '../../lauouts/BaseLayouts/BaseLayouts'

const LoginPage = () => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch({
        type: 'CHECKOUT_REQUEST',
        user: {
          email: values.email,
          password: values.password
        }
      })
    }
  })

  const handlerLoginWithGoogle = () => {
    window.alert('Эта функциональность пока не работает')
  }

  const handlerLoginWithVK = () => {
    window.alert('Эта функциональность пока не работает')
  }

  return (
    <BaseLayouts>
      <h2>Авторизация</h2>
      {error && formik.isSubmitting && (
        <span className='formPrompt formPrompt--error'>
          Ошибка входа, пожалуйста проверьте логин или пароль
        </span>
      )}
      <LoginForm
        formik={formik}
        handlerClickVK={handlerLoginWithVK}
        handlerClickGoogle={handlerLoginWithGoogle}
      />
    </BaseLayouts>
  )
}

export default LoginPage
