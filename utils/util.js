const {ApiHost} = require('../config.js');
const {hostRegex} = require('../constants.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatImg = img => img.trim() == '' ? '' : (hostRegex.test(img.trim()) ? img.trim() : ApiHost + img.trim());

const successMsg = msg => {
  wx.showToast({
    title: msg
  });
}

const failMsg = msg => {
  wx.showToast({
    title: msg,
    image: '/images/cross.png'
  });
}

module.exports = {
  formatTime: formatTime,
  formatImg: formatImg,
  successMsg: successMsg,
  failMsg: failMsg
}
