import React from 'react'

import './index.scss'

const Input = ({ type, name, required = '', ...props }) => {
  return <input type={type} name={name} required={required} {...props} />
}

export default Input
