import React from 'react'

import LabelInput from '../../components/Inputs/LabelInput/LabelInput'
import Button from '../../components/Button/Button'

import './index.scss'

const LoginPage = () => {
  const handlerSubmit = (e) => {
    console.log('Нажали кнопку !')
    console.log(e)
  }

  return (
    <main>
      <div className="BaseLayout">
        <div className="content">
          <div className="Form">
            <form>
              <div className="FormContent">
                <LabelInput label="email" name="email1" type="text" required />
                <LabelInput
                  label="password"
                  name="password"
                  type="password"
                  required
                />

                <Button onClick={handlerSubmit} styleButton="primary">
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
