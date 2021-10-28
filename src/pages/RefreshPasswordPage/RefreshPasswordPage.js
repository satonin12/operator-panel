import React from 'react'
import { useFormik } from 'formik'
import RefreshPasswordForm from '../../components/forms/RefreshPasswordForm'
import { RefreshPasswordSchema } from '../../utils/validation'

const RefreshPasswordPage = () => {
  const formik = useFormik({
    initialValues: {
      password: '',
      repeatPassword: '',
    },
    validationSchema: RefreshPasswordSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })
  return (
    <main>
      <div className="BaseLayout">
        <div className="content">
          <div className="Form">
            <h2>Обновите пароль</h2>
            {/*{formError && formik.isSubmitting && (*/}
            {/*  <span className="formPrompt formPrompt--error">*/}
            {/*    Ошибка входа, пожалуйста проверьте логин или пароль*/}
            {/*  </span>*/}
            {/*)}*/}
            <RefreshPasswordForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default RefreshPasswordPage
