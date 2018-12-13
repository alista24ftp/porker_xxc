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
  validateSubmit: function (name, phone, province, city, district, addrDetail, defAddr) {
    return this.validateName(name) 
      && this.validatePhone(phone) 
      && this.validateLocation(province)
      && this.validateLocation(city)
      && this.validateLocation(district)
      && this.validateAddrDetail(addrDetail) 
      && this.validateDefaultAddr(defAddr);
  }
};