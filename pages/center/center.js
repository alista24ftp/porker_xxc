// pages/center/center.js
const config = require('../../config.js');
const login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loggedIn: false,
    user: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  bindGetUserInfo(e) {
    console.log(e)
    var data = e.detail
    console.log(data);
    let that = this;
    let hostRegex = new RegExp('^'+config.default.ApiHost);
    if(data.iv && data.encryptedData){
      wx.login({
        success(res) {
          if (res.code) {
            // 发起网络请求
            wx.request({
              url: config.default.ApiHost + '/xcc/Login/index',
              data: {
                code: res.code,
                iv: data.iv,
                encryptedData: data.encryptedData
              },
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  if(res.data.type == 1){
                    // 已注册
                    let loginToken = res.data.data;
                    let userInfo = res.data.user;
                    userInfo.user_photo = hostRegex.test(userInfo.user_photo) ? userInfo.user_photo : config.default.ApiHost + userInfo.user_photo;
                    wx.setStorage({
                      key: 'userinfo',
                      data: {
                        loginToken: loginToken,
                        user: userInfo
                      },
                      success: function(res){
                        that.setData({
                          loggedIn: true,
                          user: userInfo
                        });
                      }
                    });
                  }else{
                    // 未注册
                    wx.redirectTo({
                      url: '../member/register/register?id=' + res.data.openId + '&unionid=' + res.data.unionId,
                      fail: function(err){
                        console.error(err);
                      }
                    })
                  }
                }else{
                  console.error('登录状态异常');
                }
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    login.default.getLoginData().then(loginData=>{
      let loginToken = loginData.loginToken;
      let userInfo = loginData.user;
      console.log(loginToken);
      console.log(userInfo);
      if (!loginToken || !userInfo) {
        that.setData({
          loggedIn: false,
          user: null
        });
      } else {
        that.setData({
          loggedIn: true,
          user: userInfo
        });
      }
    }, err=>{
      console.error('请先登录');
      wx.navigateTo({
        url: '../member/login/login'
      });
    });
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})