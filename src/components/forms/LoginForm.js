import React from 'react'
import LabelInput from '../Inputs/LabelInput/LabelInput'
import Button from '../Button/Button'

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
        </div>
      </form>
    </>
  )
}

export default LoginForm
