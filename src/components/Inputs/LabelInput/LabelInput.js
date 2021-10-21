import React from 'react'

import Input from '../Input/Input'

import './index.scss'

const LabelInput = ({
  type = 'text',
  name = '',
  required,
  label,
  ...props
}) => {
  return (
    <div className="LabelInput">
      <Input type={type} name={name} required={required} {...props} />
      <label>{label}</label>
    </div>
  )
}

export default LabelInput
