import React from 'react'
import { Link } from 'react-router-dom'

import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'
import { RouteNames } from '../../router'

import './index.scss'

const LoginForm = ({ formik }) => {
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="FormContent">
          <LabelInput
            type="email"
            label="email"
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
            label="password"
            placeholder=""
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

          <div className="formLinks">
            <Link className="formLinks--item" to={RouteNames.REGISTER}>
              Зарегистрироваться
            </Link>

            <Link className="formLinks--item" to={RouteNames.FORGOT_PASSWORD}>
              Забыли пароль ?
            </Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default LoginForm
