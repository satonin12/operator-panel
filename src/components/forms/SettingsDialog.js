import React from 'react'

import './index.scss'
import Button from '../Button/Button'
import PhrasesList from '../PhrasesList/PhrasesList'
import LabelInput from '../Inputs/LabelInput/LabelInput'

const SettingsDialog = ({ formik }) => {
  const handlerChange = (phrases) => {
    formik.setFieldValue('readyPhrases', phrases)
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className='FormContent'>
          <LabelInput
            label='Автоматическое приветствие'
            name='autoGreeting'
            value={formik.values.autoGreeting}
            onChange={formik.handleChange}
          />
          {formik.touched.autoGreeting && formik.errors.autoGreeting
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.autoGreeting}
              </span>
              )
            : null}

          <PhrasesList defaultValue={formik.values.readyPhrases} onChange={handlerChange} />
          {formik.touched.readyPhrases && formik.errors.readyPhrases
            ? (
              <span className='formPrompt formPrompt--error'>
                {formik.errors.readyPhrases}
              </span>
              )
            : null}

          <div className='formLinks'>
            <Button type='submit'>Обновить настройки диалога</Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default SettingsDialog
