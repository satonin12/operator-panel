import React, { forwardRef } from 'react'

import Input from '../Input/Input'

import './index.scss'

const LabelInput = forwardRef(({
  type = 'text',
  name = '',
  required,
  label,
  placeholder = ' ',
  ...props
}, ref) => {
  return (
    <div className='LabelInput'>
      <Input type={type} name={name} required={required} placeholder={placeholder} {...props} ref={ref} />
      <label>{label}</label>
    </div>
  )
})

export default LabelInput
