export default {
  validateUserName: function(username){
    return username && (username !== undefined) && (username.length >= 2) && (/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(username));
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
  validateEmail: function(email){
    return email && (email !== undefined) && (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email));
  },
  validateSubmit: function(username, phone, code, pwd){
    return this.validateUserName(username) && this.validatePhone(phone) && this.validateVerifyCode(code) && this.validatePassword(pwd);
  }
};