// pages/member/account/account.js
const config = require('../../../config.js');
const login = require('../../../utils/login.js');
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
    
  },

  editName: function(e){
    wx.navigateTo({
      url: '../edit/editName/editName'
    });
  },

  editEmail: function(e){
    wx.navigateTo({
      url: '../edit/editEmail/editEmail'
    });
  }, 
  
  editPassword: function (e) {
    wx.navigateTo({
      url: '../mobileVerify/mobileVerify?op=3'
    });
  },

  editPhoto: function (e) {
    wx.navigateTo({
      url: '../edit/editPhoto/editPhoto'
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
    let that = this;
    login.default.getLoginData().then(loginData => {
      console.log(loginData);
      that.setData({
        userInfo: loginData.user,
        token: loginData.loginToken
      });
    }, err => {
      console.error(err);
      wx.navigateTo({
        url: '../login/login'
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