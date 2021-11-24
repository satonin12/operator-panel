import React from 'react'
import { useFormik } from 'formik'
import RefreshPasswordForm from '../../components/forms/RefreshPasswordForm'
import { RefreshPasswordSchema } from '../../utils/validation'
import { useSelector } from 'react-redux'

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
    <main>
      <div className='BaseLayout'>
        <div className='content'>
          <div className='Form'>
            <h2>Обновите пароль</h2>
            {error && formik.isSubmitting && (
              <span className='formPrompt formPrompt--error'>
                Ошибка пароля, пожалуйста проверьте правильность паролей или
                перезагрузите страницу
              </span>
            )}
            <RefreshPasswordForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default RefreshPasswordPage
