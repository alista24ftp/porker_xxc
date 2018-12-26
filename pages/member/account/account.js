// pages/member/account/account.js
const {ApiHost} = require('../../../config.js');
const {getLoginData, goLogin} = require('../../../utils/login.js');
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
      url: '/pages/member/edit/editName/editName'
    });
  },

  editEmail: function(e){
    wx.navigateTo({
      url: '/pages/member/edit/editEmail/editEmail'
    });
  }, 
  
  editPassword: function (e) {
    wx.navigateTo({
      url: '/pages/member/mobileVerify/mobileVerify?op=3'
    });
  },

  editPhoto: function (e) {
    wx.navigateTo({
      url: '/pages/member/edit/editPhoto/editPhoto'
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
    getLoginData().then(loginData => {
      console.log(loginData);
      that.setData({
        userInfo: loginData.user,
        token: loginData.loginToken
      });
    }, err => {
      goLogin();
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