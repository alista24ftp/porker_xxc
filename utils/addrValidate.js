const validateName = name => {
  if (!name || (name === undefined) || name.trim().length == 0){
    return {
      status: false,
      errMsg: '收货人不能为空'
    };
  }
  if(!(/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(name))){
    return {
      status: false,
      errMsg: '收货人格式错误'
    };
  }
  return {status: true};
};

const validatePhone = phone => {
  if(!phone || (phone === undefined)){
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
      errMsg: '电话只允许数字'
    };
  }
  return {status: true};
};

const validateLocation = location => {
  if(!location || (location === undefined)){
    return {
      status: false,
      errMsg: '省市区不能为空'
    };
  } 
  if(location.length < 2){
    return {
      status: false,
      errMsg: '省市区长度太短'
    };
  } 
  if(!(/^[a-zA-Z\u4E00-\u9FFF]+$/.test(location))){
    return {
      status: false,
      errMsg: '省市区格式错误'
    };
  }
  return {status: true};
};

const validateAddrDetail = addrDetail => {
  if(!addrDetail || (addrDetail === undefined) || addrDetail.trim().length == 0){
    return {
      status: false,
      errMsg: '地址不能为空'
    };
  } 
  if(addrDetail.length < 6){
    return {
      status: false,
      errMsg: '地址长度小于6'
    };
  } 
  if(!(/^[_0-9a-zA-Z\- \u3000\u4E00-\u9FFF　]+$/.test(addrDetail))){
    return {
      status: false,
      errMsg: '地址格式错误'
    };
  }
  return {status: true};
};

const validateDefaultAddr = defAddr => {
  if (!defAddr || (defAddr === undefined) || (defAddr.length != 1) || !(defAddr == 0 || defAddr == 1)){
    return {
      status: false,
      errMsg: '默认不能为空'
    };
  } 
  return {status: true};
};

const validateProvIndex = provIndex => {
  if(provIndex <= 0){
    return {
      status: false,
      errMsg: '省不能为空'
    };
  }
  return {status: true};
};

const validateCityIndex = cityIndex => {
  if (cityIndex <= 0){
    return {
      status: false,
      errMsg: '市不能为空'
    };
  }
  return {status: true};
};

const validateDistIndex = distIndex => {
  if (distIndex <= 0){
    return {
      status: false,
      errMsg: '区不能为空'
    };
  }
  return {status: true};
};

const validateSubmit = (name, phone, province, city, district, addrDetail, defAddr) => {
  let validName = validateName(name);
  let validPhone = validatePhone(phone);
  // let validProv = validateLocation(province);
  // let validCity = validateLocation(city);
  // let validDist = validateLocation(district);
  let validProvIndex = validateProvIndex(province);
  // let validCityIndex = validateCityIndex(city);
  // let validDistIndex = validateDistIndex(district);
  let validAddrDetail = validateAddrDetail(addrDetail);
  let validDefaultAddr = validateDefaultAddr(defAddr);
  if(!validName.status) return validName;
  if(!validPhone.status) return validPhone;
  if(!validProvIndex.status) return validProvIndex;
  if(!validAddrDetail.status) return validAddrDetail;
  if(!validDefaultAddr.status) return validDefaultAddr;
  return {status: true};
};
    
    
module.exports = {
  validateName, validatePhone, validateLocation, validateAddrDetail, validateDefaultAddr, validateProvIndex, validateCityIndex, validateDistIndex, validateSubmit
};