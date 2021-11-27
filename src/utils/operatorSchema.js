export const AssignNewOperatorToDefaultOperatorSchema = (operator) => {
  return Object.assign({}, operatorSchema, operator)
}

const operatorSchema = {
  email: null,
  uid: null,
  avatar: null,
  name: null
}
