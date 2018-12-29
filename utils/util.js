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

const getPrevPage = () => {
  let pages = getCurrentPages();
  return pages.length >= 2 ? pages[pages.length-2] : pages[0];
}

const setPrevPageData = (data, callback) => {
  let prevPage = getPrevPage();
  prevPage.setData(data, callback);
}

const setPrevPageAndBack = (data, succMsg, failedMsg) => {
  setPrevPageData(data, ()=>{
    wx.navigateBack({
      delta: 1,
      success: function(res){
        if(succMsg !== null && succMsg !== undefined)
          successMsg(succMsg);
      },
      fail: function(err){
        if(failedMsg !== null && failedMsg !== undefined)
          failMsg(failedMsg);
      }
    });
  });
}

module.exports = { 
  formatTime: formatTime,
  formatImg: formatImg,
  successMsg: successMsg,
  failMsg: failMsg,
  setPrevPageAndBack
}
