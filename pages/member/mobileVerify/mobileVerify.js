// pages/member/mobileVerify/mobileVerify.js
const {ApiHost} = require('../../../config.js');
const {getUserInfo, goLogin} = require('../../../utils/login.js');
const {successMsg, failMsg} = require('../../../utils/util.js');
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
    let that = this;
    this.setData({
      op: options.op
    });
    
  },

  checkCode: function(e){
    console.log(e);
    let code = e.detail.value;
    let allowProceed = code == this.data.verifyCode;
    this.setData({
      code: code,
      allowProceed: allowProceed
    });
  },

  clearCode: function(e){
    console.log(e);
    this.setData({
      code: '',
      allowProceed: false
    });
  },

  getCode: function(e){
    let phoneNum = this.data.userInfo.user_phone;
    let that = this;
    wx.request({
      url: ApiHost + '/xcc/Login/verificationCode',
      method: 'POST',
      data: {
        user_phone: phoneNum
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          //console.log(res.data.data);
          if(res.data.type == 1){
            that.setData({
              verifyCode: res.data.data,
              disabled: false,
              allowProceed: false
            });
          }else{
            console.error('获取验证码错误');
            failMsg('获取验证码错误');
            that.setData({
              disabled: false,
              allowProceed: false
            });
          }
        }
      },
      fail: function(err){
        console.error(err);
        failMsg('获取验证码错误');
      }
    });
  },

  proceedEdit: function(e){
    let allowProceed = this.data.allowProceed;
    let nextOp = this.data.op;
    if(allowProceed !== undefined && allowProceed){
      if(nextOp == 1){
        wx.redirectTo({
          url: '/pages/member/edit/editName/editName',
        })
      }else if(nextOp == 2){
        wx.redirectTo({
          url: '/pages/member/edit/editEmail/editEmail',
        })
      }else if(nextOp == 3){
        wx.redirectTo({
          url: '/pages/member/edit/editPassword/editPassword',
        })
      }else if(nextOp == 4){
        wx.redirectTo({
          url: '/pages/member/edit/editPhoto/editPhoto',
        })
      }else{
        console.error('无法获取修改信息');
        failMsg('无法获取信息');
      }
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
    getUserInfo().then(userInfo => {
      that.setData({
        userInfo: userInfo,
        disabled: true
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