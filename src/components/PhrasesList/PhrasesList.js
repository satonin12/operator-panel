import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import Button from '../Button/Button'
import LabelInput from '../Inputs/LabelInput/LabelInput'

import './index.scss'

const PhrasesList = ({ defaultValue, onChange }) => {
  const [phrases, setPhrases] = useState(defaultValue || [])

  useEffect(() => {
    onChange(phrases)
    // eslint-disable-next-line
  }, [phrases])

  const addPhrase = (phrase) => {
    setPhrases([...phrases, phrase])
  }

  const removePhrase = (event, id) => {
    event.preventDefault()
    const filteredPhrases = [...phrases].filter(phrase => phrase.id !== id)
    setPhrases(filteredPhrases)
  }

  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim().length !== 0) {
      addPhrase({
        id: uuidv4(),
        text: input
      })
      setInput('')
    }
  }

  return (
    <>
      <div className='SelectList'>
        <div className='SelectListItem SelectListItem--Title'>
          <h5>Готовые фразы</h5>
        </div>
        <div className='SelectListItem SelectListItem--Add'>
          <LabelInput
            value={input}
            name='addPhrase'
            label='Напишите сюда новую фразу'
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSubmit}>+</Button>
        </div>
        <div className='SelectListItem SelectListItem--List'>
          <ul className='PhraseList'>
            {phrases.map((phrase, index) => (
              <li key={index} className='PhraseList_Item'>
                {phrase.text}
                <Button onClick={(e) => removePhrase(e, phrase.id)}>X</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default PhrasesList
