import React from 'react'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'
import { Link } from 'react-router-dom'
import { RouteNames } from '../../router'

const ForgotPasswordForm = ({ formik }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="FormContent">
          <LabelInput
            name="email"
            type="text"
            label="email"
            placeholder=""
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <span className="formPrompt formPrompt--error">
              {formik.errors.email}
            </span>
          ) : null}

          <Button type="submit" styleButton="primary">
            Отправить ссылку для восстановления
          </Button>

          <div className="formLinks">
            <Link className="formLinks--item" to={RouteNames.LOGIN}>
              Войти
            </Link>

            <Link className="formLinks--item" to={RouteNames.REGISTER}>
              Регистрация
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default ForgotPasswordForm
