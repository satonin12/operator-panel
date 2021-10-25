import React from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'

import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import Button from '../../components/Button/Button'

import './index.scss'

const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email должен иметь общепринятый вид адреса электронной почты')
    .required('Email должен быть введен'),
  password: Yup.string().required('Пароль должен быть введен'),
})

const LoginPage = () => {
  const dispatch = useDispatch()
  const formError = useSelector((state) => state.error)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
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
            <h3>Войдите чтобы продолжить</h3>
            {formError && formik.isSubmitting && (
              <span className="formPrompt formPrompt--error">
                Ошибка входа, пожалуйста проверьте логин или пароль
              </span>
            )}
            <form onSubmit={formik.handleSubmit}>
              <div className="FormContent">
                <LabelInput
                  type="email"
                  label="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <span className="formPrompt formPrompt--error">
                    {formik.errors.email}
                  </span>
                ) : null}

                <LabelInput
                  name="password"
                  type="password"
                  label="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <span className="formPrompt formPrompt--error">
                    {formik.errors.password}
                  </span>
                ) : null}

                <Button type="submit" styleButton="primary">
                  Войти
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
