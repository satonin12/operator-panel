import React from 'react'

import Input from '../Input/Input'

import './index.scss'

const LabelInput = (props) => {
  return (
    <div className="LabelInput">
      <Input
        type={props.type || 'text'}
        name={props.name || ''}
        required={props.required}
      />
      <label>{props.label}</label>
    </div>
  )
}

export default LabelInput
