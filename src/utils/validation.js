import * as Yup from 'yup'

const EmailValidation = Yup.object().shape({
  email: Yup.string()
    .required('Email должен быть введен')
    .email('Email должен иметь общепринятый вид адреса электронной почты')
})

const PasswordValidation = Yup.object().shape({
  password: Yup.string()
    .required('Пароль должен быть введен')
    .min(8, 'Пароль должен содержать длину не менее 8 символов')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Пароль должен содержать цифру, буквы в нижнем и верхнем регистре'
    )
})

const RepeatPasswordValidation = Yup.object().shape({
  repeatPassword: Yup.string()
    .required('Пароль должен быть введен')
    .min(8, 'Пароль должен содержать длину не менее 8 символов')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Пароль должен содержать цифру, буквы в нижнем и верхнем регистре'
    )
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
})

export const LoginSchema = Yup.object()
  .shape({})
  .concat(EmailValidation)
  .concat(PasswordValidation)

export const RegisterSchema = Yup.object()
  .shape({})
  .concat(LoginSchema)
  .concat(RepeatPasswordValidation)

export const ForgotPasswordSchema = Yup.object().shape({
}).concat(EmailValidation)

export const RefreshPasswordSchema = Yup.object()
  .shape({})
  .concat(PasswordValidation)
  .concat(RepeatPasswordValidation)
