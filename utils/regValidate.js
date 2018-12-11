export default {
  validateUserName: function(username){
    return username && (username !== undefined) && (username.length >= 3) && (/^[_0-9a-zA-Z]+$/.test(username));
  },
  validatePhone: function(phone){
    return phone && (phone !== undefined) && (phone.length == 11) && (/^[0-9]+$/.test(phone));
  },
  validateVerifyCode: function(code){
    return code && (code !== undefined) && (code.length == 4) && (/^[0-9]+$/.test(code));
  },
  validatePassword: function(pwd){
    return pwd && (pwd !== undefined) && (pwd.length >= 4) && (/^[_0-9a-zA-Z\-]+$/.test(pwd));
  },
  validateSubmit: function(username, phone, code, pwd){
    return this.validateUserName(username) && this.validatePhone(phone) && this.validateVerifyCode(code) && this.validatePassword(pwd);
  }
};