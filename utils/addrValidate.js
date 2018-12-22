export default {
  validateName: function (name) {
    return name && (name !== undefined) && (name.length >= 2) && (/^[_\-0-9a-zA-Z\u4E00-\u9FFF]+$/.test(name));
  },
  validatePhone: function (phone) {
    return phone && (phone !== undefined) && (phone.length == 11) && (/^[0-9]+$/.test(phone));
  },
  validateLocation: function (location) {
    return location && (location !== undefined) && (location.length >= 2) && (/^[a-zA-Z\u4E00-\u9FFF]+$/.test(location));
  },
  validateAddrDetail: function (addrDetail) {
    return addrDetail && (addrDetail !== undefined) && (addrDetail.length >= 6) && (/^[_0-9a-zA-Z\- \u3000\u4E00-\u9FFF　]+$/.test(addrDetail));
  },
  validateDefaultAddr: function(defAddr){
    return defAddr && (defAddr !== undefined) && (defAddr.length == 1) && (defAddr == 0 || defAddr == 1);
  },
  validateProvIndex: function(provIndex){
    return provIndex > 0;
  },
  validateCityIndex: function (cityIndex) {
    return cityIndex > 0;
  },
  validateDistIndex: function (distIndex) {
    return distIndex > 0;
  },
  validateSubmit: function (name, phone, province, city, district, addrDetail, defAddr) {
    return this.validateName(name) 
      && this.validatePhone(phone) 
      //&& this.validateLocation(province)
      //&& this.validateLocation(city)
      //&& this.validateLocation(district)
      && this.validateProvIndex(province)
      //&& this.validateCityIndex(city)
      //&& this.validateDistIndex(district)
      && this.validateAddrDetail(addrDetail) 
      && this.validateDefaultAddr(defAddr);
  }
};