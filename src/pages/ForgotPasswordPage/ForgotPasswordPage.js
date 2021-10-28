import React from 'react'
import { useFormik } from 'formik'

import ForgotPasswordForm from '../../components/forms/ForgotPasswordForm'
import { ForgotPasswordSchema } from '../../utils/validation'

const ForgotPasswordPage = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })
  return (
    <main>
      <div className="BaseLayout">
        <div className="content">
          <div className="Form">
            <h2>Забыли пароль</h2>
            {/*{formError && formik.isSubmitting && (*/}
            {/*  <span className="formPrompt formPrompt--error">*/}
            {/*    Ошибка входа, пожалуйста проверьте логин или пароль*/}
            {/*  </span>*/}
            {/*)}*/}
            <ForgotPasswordForm formik={formik} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
