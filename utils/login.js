const config = require('../config.js');
export default {
  
  login: function(){
    return new Promise(function(resolve, reject){
      wx.login({
        success(res) {
          if (res.code) {
            wx.request({
              url: config.default.ApiHost + '/xcc/Login/index',
              method: 'POST',
              data: {
                code: res.code
              },
              success: function (data) {

                if (data.data.code == 200) {
                  let registered = (data.data.type == 1);
                  let loginData = data.data.data;
                  //console.log('Registered: ' + (registered ? 'yes' : 'no'));
                  //console.log(loginData);
                  if (registered) {
                    let loginToken = loginData;
                    console.log(loginToken);
                    // Get user info
                    wx.request({
                      url: config.default.ApiHost + '/xcc/Login/getInfo',
                      method: 'POST',
                      data: {
                        token: '0mo9fhAWJ4doPi82U'//loginToken
                      },
                      success: function (user) {
                        //console.log(user);
                        if (user.data.code == 200) {
                          let userInfo = user.data.data;
                          userInfo.user_photo = config.default.ApiHost + userInfo.user_photo;
                          wx.setStorage({
                            key: 'userinfo',
                            data: {
                              loginToken: '0mo9fhAWJ4doPi82U',//loginToken,
                              user: userInfo
                            },
                            success: function (info) {
                              resolve({
                                loginToken: '0mo9fhAWJ4doPi82U',//loginToken,
                                user: userInfo,
                                loggedIn: true
                              });
                            },
                            fail: function (err) {
                              reject(err);
                            }
                          });

                        } else {
                          reject('无法获取用户信息');
                        }
                      }
                    });
                  } else {
                    let openId = loginData;
                    // Register
                    wx.redirectTo({
                      url: '../member/register/register?id=' + openId,
                      success: function(res){
                        reject('请先登陆');
                      },
                      fail: function(err){
                        reject(err);
                      }
                    })
                  }

                } else {
                  //console.error('Login unsuccessful');
                  reject('无法登陆');
                }
              }
            });

          } else {
            reject('Unable to login: no login code');
          }
        },
        fail(err) {
          reject('请重新登录微信');
        }
      })
    });
  }
  
};