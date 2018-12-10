// pages/center/center.js
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res){
        if(res.code){
          wx.request({
            url: config.default.ApiHost + '/xcc/Login/index',
            method: 'POST',
            data: {
              code: res.code
            },
            success: function(data){

              if(data.data.code == 200){
                let registered = (data.data.type == 1);
                let loginData = data.data.data;
                //console.log('Registered: ' + (registered ? 'yes' : 'no'));
                //console.log(loginData);
                if(registered){
                  let loginToken = loginData;
                  // Get user info
                  wx.request({
                    url: config.default.ApiHost + '/xcc/Login/getInfo',
                    method: 'POST',
                    data: {
                      Only: loginToken
                    },
                    success: function (user) {
                      console.log(user);
                    }
                  });
                }else{
                  let openId = loginData;
                  // Register
                  wx.redirectTo({
                    url: '../member/register/register?id=' + openId,
                  })
                }
                
              }else{
                console.error('Login unsuccessful');
                wx.redirectTo({
                  url: '../member/register/register'
                });
              }
            }
          });
          
        }else{
          console.error('Unable to login: no login code');
        }
      },
      fail(err){
        console.error(err);
      }
    })
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