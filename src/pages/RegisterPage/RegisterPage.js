import React from 'react'
import { useFormik } from 'formik'

import RegisterForm from '../../components/forms/RegisterForm'
import { RegisterSchema } from '../../utils/validation'

import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayouts from '../../lauouts/BaseLayouts/BaseLayouts'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      dispatch({
        type: 'CHECKOUT_REGISTRATION_REQUEST',
        user: {
          email: values.email,
          password: values.password
        }
      })
    }
  })
  return (
    <BaseLayouts>
      <h2>Регистрация</h2>
      {error && formik.isSubmitting && (
        <span className='formPrompt formPrompt--error'>
          Ошибка регистрации, пожалуйста проверьте правильность ввода
          логина или пароля или попробуйте перезагрузить страницу
        </span>
      )}
      <RegisterForm formik={formik} />
    </BaseLayouts>

  )
}

export default RegisterPage
