import React from 'react'

import './index.scss'

const STYLES = ['primary', 'default', 'disabled']

const Button = ({
  children,
  onClick,
  disabled = false,
  styleButton,
  ...props
}) => {
  let style

  if (!disabled) {
    style = STYLES.includes(styleButton) ? styleButton : 'default'
  } else {
    style = STYLES[2]
  }

  return (
    <button
      className={`Button ${style}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children || 'label'}
    </button>
  )
}

export default Button
