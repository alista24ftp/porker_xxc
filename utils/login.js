const config = require('../config.js');
export default {
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
  }
  
};