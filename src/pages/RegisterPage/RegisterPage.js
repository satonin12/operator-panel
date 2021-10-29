import React from 'react'
import { useFormik } from 'formik'

import RegisterForm from '../../components/forms/RegisterForm'
import { RegisterSchema } from '../../utils/validation'

import './index.scss'
import { useDispatch } from 'react-redux'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
      console.log(values)
      dispatch({
        type: 'CHECKOUT_REGISTRATION_REQUEST',
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
            <h2>Регистрация</h2>
            {/*{formError && formik.isSubmitting && (*/}
            {/*  <span className="formPrompt formPrompt--error">*/}
            {/*    Ошибка входа, пожалуйста проверьте логин или пароль*/}
            {/*  </span>*/}
            {/*)}*/}
            <RegisterForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default RegisterPage
