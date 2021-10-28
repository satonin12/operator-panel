import React from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'

import LoginForm from '../../components/forms/LoginForm'

import './index.scss'
import { LoginSchema } from '../../utils/validation'

const LoginPage = () => {
  const dispatch = useDispatch()
  const formError = useSelector((state) => state.error)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch({
        type: 'CHECKOUT_REQUEST',
        user: {
          email: values.email,
          password: values.password,
        },
      })
    },
  })

  return (
    <main>
      <div className="BaseLayout">
        <div className="content">
          <div className="Form">
            <h2>Авторизация</h2>
            {formError && formik.isSubmitting && (
              <span className="formPrompt formPrompt--error">
                Ошибка входа, пожалуйста проверьте логин или пароль
              </span>
            )}
            <LoginForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
