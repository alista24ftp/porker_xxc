const validateName = name => name && (name !== undefined) && (name.length >= 2) && (/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(name));

const validatePhone = phone => phone && (phone !== undefined) && (phone.length == 11) && (/^[0-9]+$/.test(phone));

const validateLocation = location => location && (location !== undefined) && (location.length >= 2) && (/^[a-zA-Z\u4E00-\u9FFF]+$/.test(location));

const validateAddrDetail = addrDetail => addrDetail && (addrDetail !== undefined) && (addrDetail.length >= 6) && (/^[_0-9a-zA-Z\- \u3000\u4E00-\u9FFF　]+$/.test(addrDetail));

const validateDefaultAddr = defAddr => defAddr && (defAddr !== undefined) && (defAddr.length == 1) && (defAddr == 0 || defAddr == 1);

const validateProvIndex = provIndex => provIndex > 0;

const validateCityIndex = cityIndex => cityIndex > 0;

const validateDistIndex = distIndex => distIndex > 0;

const validateSubmit = (name, phone, province, city, district, addrDetail, defAddr) => validateName(name)
    && validatePhone(phone)
    //&& validateLocation(province)
    //&& validateLocation(city)
    //&& validateLocation(district)
    && validateProvIndex(province)
    //&& validateCityIndex(city)
    //&& validateDistIndex(district)
    && validateAddrDetail(addrDetail)
    && validateDefaultAddr(defAddr);
    
module.exports = {
  validateName, validatePhone, validateLocation, validateAddrDetail, validateDefaultAddr, validateProvIndex, validateCityIndex, validateDistIndex, validateSubmit
};