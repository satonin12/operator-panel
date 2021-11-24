import React from 'react'
import { useFormik } from 'formik'

import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import { ForgotPasswordSchema } from '../../utils/validation'
import { useDispatch, useSelector } from 'react-redux'

const ForgotPasswordPage = () => {
  const dispatch = useDispatch()
  const { error } = useSelector((state) => state)
  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => {
      window.alert(JSON.stringify(values, null, 2))
      dispatch({
        type: 'FORGOT_PASSWORD_REQUEST',
        user: {
          email: values.email
        }
      })
    }
  })
  return (
    <main>
      <div className='BaseLayout'>
        <div className='content'>
          <div className='Form'>
            <h2>Забыли пароль</h2>
            {error && formik.isSubmitting && (
              <span className='formPrompt formPrompt--error'>
                Ошибка отправки ссылки, пожалуйста проверьте правильность Email
                или перезагрузите страницу
              </span>
            )}
            <ForgotPasswordForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
