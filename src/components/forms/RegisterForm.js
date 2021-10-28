import React from 'react'
import { Link } from 'react-router-dom'

import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'
import { RouteNames } from '../../router'

import './index.scss'

const RegisterForm = ({ formik }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="FormContent">
          <LabelInput
            type="email"
            label="Email"
            name="email"
            placeholder=""
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
            Регистрация
          </Button>

          <div className="formLinks">
            <Link className="formLinks--item" to={RouteNames.LOGIN}>
              Войти
            </Link>

            <Link className="formLinks--item" to="/refresh-password">
              Забыли пароль ?
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default RegisterForm
