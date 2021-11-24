import React from 'react'

import './index.scss'

const BaseLayouts = ({ children }) => {
  return (
    <main>
      <div className='BaseLayout'>
        <div className='content'>
          <div className='Form'>
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}

export default BaseLayouts
