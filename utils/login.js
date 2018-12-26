const {failMsg} = require('./util.js');
module.exports = {
  getToken: function(){
    return new Promise(function(resolve, reject){
      wx.getStorage({
        key: 'userinfo',
        success: function(data){
          resolve(data.data.loginToken);
        },
        fail: function(err){
          reject(err);
        }
      })
    });
  },

  getUserInfo: function(){
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'userinfo',
        success: function (data) {
          resolve(data.data.user);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  getLoginData: function(){
    return new Promise(function (resolve, reject) {
      wx.getStorage({
        key: 'userinfo',
        success: function (data) {
          resolve(data.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },

  goLogin: () => {
    wx.navigateTo({
      url: '/pages/member/login/login',
      success: function (res) {
        failMsg('请先登录');
      }
    });
  }
  
};