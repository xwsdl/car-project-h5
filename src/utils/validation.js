// 简单校验：只判断是否有值
export const getAccountRules = (t) => [
  { required: true, message: t ? t('login.fillIn') + t('login.account') : '请输入账号' }
]

export const getPasswordRules = (t) => [
  { required: true, message: t ? t('login.fillIn') + t('login.password') : '请输入密码' }
]

export const getConfirmPasswordRules = (t, password) => [
  { required: true, message: t ? t('login.fillIn') + t('login.confirmPassword') : '请确认密码' },
  {
    validator: (value) => value === password,
    message: t ? t('login.passwordNotMatch') : '两次输入的密码不一致'
  }
]
