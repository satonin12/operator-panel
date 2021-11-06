import React from 'react'
import { useFormik } from 'formik'
import RefreshPasswordForm from '../../components/forms/RefreshPasswordForm'
import { RefreshPasswordSchema } from '../../utils/validation'
import { useSelector } from 'react-redux'
import BaseLayouts from '../../lauouts/BaseLayouts/BaseLayouts'

const RefreshPasswordPage = () => {
  const { error } = useSelector((state) => state)
  const formik = useFormik({
    initialValues: {
      password: '',
      repeatPassword: ''
    },
    validationSchema: RefreshPasswordSchema,
    onSubmit: (values) => {
      window.alert(JSON.stringify(values, null, 2))
    }
  })
  return (
    <BaseLayouts>
      <h2>Обновите пароль</h2>
      {error && formik.isSubmitting && (
        <span className='formPrompt formPrompt--error'>
          Ошибка пароля, пожалуйста проверьте правильность паролей или
          перезагрузите страницу
        </span>
      )}
      <RefreshPasswordForm formik={formik} />
    </BaseLayouts>
  )
}

export default RefreshPasswordPage
