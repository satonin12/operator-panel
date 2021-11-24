import React from 'react'

import './index.scss'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'
import { Link } from 'react-router-dom'
import { RouteNames } from '../../router'

const RefreshPasswordForm = ({ formik }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="FormContent">
          <LabelInput
            name="password"
            type="password"
            label="Пароль"
            placeholder=""
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <span className="formPrompt formPrompt--error">
              {formik.errors.password}
            </span>
          ) : null}

          <LabelInput
            name="repeatPassword"
            type="password"
            label="Подтверждение пароля"
            placeholder=""
            onChange={formik.handleChange}
            value={formik.values.repeatPassword}
          />
          {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
            <span className="formPrompt formPrompt--error">
              {formik.errors.repeatPassword}
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

export default RefreshPasswordForm
