import React from 'react'
import { useFormik } from 'formik'

import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import Button from '../../components/Button/Button'

import './index.scss'

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
    },
  })

  return (
    <main>
      <div className="BaseLayout">
        <div className="content">
          <div className="Form">
            <h3>Войдите чтобы продолжить</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="FormContent">
                <LabelInput
                  required
                  type="email"
                  label="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />

                <LabelInput
                  required
                  name="password"
                  type="password"
                  label="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />

                <Button type="submit" styleButton="primary">
                  Войти
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
