const validateUserName = username => username && (username !== undefined) && (username.length >= 2) && (/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(username));

const validatePhone = phone => phone && (phone !== undefined) && (phone.length == 11) && (/^[0-9]+$/.test(phone));

const validateVerifyCode = code => code && (code !== undefined) && (code.length == 4) && (/^[0-9]+$/.test(code));

const validatePassword = pwd => pwd && (pwd !== undefined) && (pwd.length >= 4) && (/^[_0-9a-zA-Z\-]+$/.test(pwd));

const validateEmail = email => email && (email !== undefined) && (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));

const validateSubmit = (username, phone, code, pwd) => validateUserName(username) && validatePhone(phone) && validateVerifyCode(code) && validatePassword(pwd);

module.exports = {
  validateUserName, validatePhone, validateVerifyCode, validatePassword, validateEmail, validateSubmit
};