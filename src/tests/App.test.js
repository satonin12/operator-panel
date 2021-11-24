/* eslint-disable */

import React from 'react'
import './setupTests'
import { shallow } from 'enzyme'

import App from '../App'
import LoginPage from '../pages/LoginPage/LoginPage'

describe('rendering components', () => {
  it('renders App component without crashing', () => {
    shallow(<App />)
  })

  it('render of the App component with the App element', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.find('.App')).toHaveLength(1)
  })

  it('render of the App component with the LoginPage component', () => {
    const myComponent = shallow(<App />)
    expect(myComponent.contains(<LoginPage />)).toEqual(true)
  })
})
