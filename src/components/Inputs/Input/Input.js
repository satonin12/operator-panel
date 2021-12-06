import React, { forwardRef } from 'react'

import './index.scss'

const Input = forwardRef(({ type, name, required = '', ...props }, ref) => {
  return <input type={type} name={name} required={required} {...props} ref={ref} />
})

export default Input
