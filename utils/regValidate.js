const validateUserName = username => {
  if(!username || (username === undefined) || (username.trim().length == 0)){
    return {
      status: false,
      errMsg: '昵称不能为空'
    };
  } 
  if(username.trim().length > 9){
    return {
      status: false,
      errMsg: '昵称不能超过9'
    };
  }
  /*
  if(!(/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(username))){
    return {
      status: false,
      errMsg: '昵称格式错误'
    };
  }*/
  return {status: true};
};

const validatePhone = phone => {
  if (!phone || (phone === undefined)){
    return {
      status: false,
      errMsg: '电话不能为空'
    };
  }
  if(phone.length != 11){
    return {
      status: false,
      errMsg: '电话长度错误'
    };
  }
  if(!(/^[0-9]+$/.test(phone))){
    return {
      status: false,
      errMsg: '电话必须为数字'
    };
  }
  return {status: true};
};

const validateVerifyCode = code => {
  if (!code || (code === undefined)){
    return {
      status: false,
      errMsg: '验证码不能为空'
    };
  }
  if (code.length != 4){
    return {
      status: false,
      errMsg: '验证码长度错误'
    };
  }
  if (!(/^[0-9]+$/.test(code))){
    return {
      status: false,
      errMsg: '验证码需为数字'
    };
  }
  return {status: true};
}; 

const validatePassword = pwd => {
  if (!pwd || (pwd === undefined)){
    return {
      status: false,
      errMsg: '密码不能为空'
    };
  } 
  if(pwd.length < 4){
    return {
      status: false,
      errMsg: '密码不能小于4'
    };
  } 
  if(!(/^[_0-9a-zA-Z\-]+$/.test(pwd))){
    return {
      status: false,
      errMsg: '密码格式错误'
    };
  }
  return {status: true};
};

const validateEmail = email => {
  if (!email || (email === undefined)){
    return {
      status: false,
      errMsg: '邮箱不能为空'
    };
  }
  if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
    return {
      status: false,
      errMsg: '邮箱格式错误'
    };
  }
  return {status: true};
}; 

const validateSubmit = (username, phone, code, pwd) => {
  let validName = validateUserName(username);
  let validPhone = validatePhone(phone);
  let validCode = validateVerifyCode(code);
  let validPwd = validatePassword(pwd);
  if(!validName.status) return validName;
  if(!validPhone.status) return validPhone;
  if(!validCode.status) return validCode;
  if(!validPwd.status) return validPwd;
  return {status: true};
};

module.exports = {
  validateUserName, validatePhone, validateVerifyCode, validatePassword, validateEmail, validateSubmit
};