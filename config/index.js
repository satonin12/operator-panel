/*
 ? This code demonstrates the change of .en in the configuration for production and development.
 ! To run, enter in the terminal node .authAction.js - being in the config folder: you will see the production config
 * To run NODE_ENV=development node authAction.js command: you will see the development config
 */

if (process.env.NODE_ENV) {
  require('dotenv').config({
    // eslint-disable-next-line node/no-path-concat
    path: `${__dirname}/.env.${process.env.NODE_ENV}`
  })
} else {
  require('dotenv').config()
}

// eslint-disable-next-line node/no-path-concat
console.log(`${__dirname}/.env.${process.env.NODE_ENV}`)
console.log(process.env.MY_VAR_TEST)
console.log(process.env.MY_TEST_NUMBER)
