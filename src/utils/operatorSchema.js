export const AssignNewOperatorToDefaultOperatorSchema = (operator) => {
  return Object.assign({}, operatorSchema, operator)
}

// ? NOTICE : we put blank lines because firebase trims the field null and trims the object
const operatorSchema = {
  email: null,
  uid: null,
  avatar: '',
  name: ''
}
