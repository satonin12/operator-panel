import React from 'react'

import './index.scss'

const Input = (props) => {
  return (
    <input
      type={props.type}
      name={props.name}
      required={props.required || ''}
    />
  )
}

export default Input
