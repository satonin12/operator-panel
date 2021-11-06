import React from 'react'
import { useFormik } from 'formik'

import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import { ForgotPasswordSchema } from '../../utils/validation'
import { useDispatch, useSelector } from 'react-redux'
import BaseLayouts from '../../lauouts/BaseLayouts/BaseLayouts'

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
    <BaseLayouts>
      <h2>Забыли пароль</h2>
      {error && formik.isSubmitting && (
        <span className='formPrompt formPrompt--error'>
          Ошибка отправки ссылки, пожалуйста проверьте правильность Email
          или перезагрузите страницу
        </span>
      )}
      <ForgotPasswordForm formik={formik} />
    </BaseLayouts>

  )
}

export default ForgotPasswordPage
