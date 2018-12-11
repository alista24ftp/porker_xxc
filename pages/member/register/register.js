// pages/member/register/register.js
const config = require('../../../config.js');
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
    let openId = options.id;
    //console.log(openId);
    this.setData({
      openId: openId
    });
  },

  bindPhone: function(e){
    //console.log(e);
    this.setData({
      phoneNum: e.detail.value
    })
  },

  getVerify: function(e){
    //console.log(e);
    let phoneNum = e.target.dataset.phone;
    let that = this;
    wx.request({
      url: config.default.ApiHost + '/xcc/Login/verificationCode',
      method: 'POST',
      data: {
        user_phone: phoneNum
      },
      success: function(res){
        if(res.data.code == 200){
          //console.log(res.data.data);
          that.setData({
            verifyCode: res.data.data,
            user_phone: phoneNum
          });
        }else{
          console.error(res);
        }
      },
      fail: function(err){
        console.error(err);
      }
    });
  },

  submitReg: function(e){
    wx.request({
      url: config.default.ApiHost + '/xcc/Login/register',
      method: 'POST',
      data: {
        user_phone: this.data.user_phone,
        user_pwd: '',
        open_id: this.data.openId
      },
      success: function(res){
        if(res.data.code == 200){
          if(res.data.type == 1){
            console.log('Registration success');
            let loginToken = res.data.data;
            let userInfo = res.data.user;
            userInfo.user_photo = config.default.ApiHost + userInfo.user_photo;
            console.log(loginToken);
            console.log(userInfo);
            wx.setStorage({
              key: 'userinfo',
              data: {
                loginToken: loginToken,
                user: userInfo
              },
              success: function (info) {
                wx.reLaunch({
                  url: '../../center/center',
                  success: function(r){
                    console.log(r);
                  },
                  fail: function(err){
                    console.error(err);
                  }
                });
              },
              fail: function (err) {
                console.error(err);
              }
            });
          }else if(res.data.type == 2){
            console.error('User registration failed');
          }else{
            console.error('User already registered');
          }
        }else{
          console.error('Registration failed');
        }
      }
    });
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