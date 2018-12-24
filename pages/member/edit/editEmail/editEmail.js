// pages/member/edit/editEmail/editEmail.js
const config = require('../../../../config.js');
const login = require('../../../../utils/login.js');
const validator = require('../../../../utils/regValidate.js');
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

  checkEmail: function (e) {
    console.log(e);
    let newEmail = e.detail.value;
    let allowProceed = validator.default.validateEmail(newEmail);

    this.setData({
      newEmail,
      allowProceed
    });
  },

  clearEmail: function (e) {
    console.log(e);
    this.setData({
      newEmail: '',
      allowProceed: false
    });
  },

  proceedEdit: function (e) {
    let { allowProceed, token, newEmail, userInfo } = this.data;
    if (allowProceed) {
      wx.request({
        url: config.default.ApiHost + '/xcc/home/userUpdate',
        method: 'POST',
        data: {
          token: token,
          user_email: newEmail
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log('修改成功');
              userInfo.user_email = newEmail;
              wx.setStorage({
                key: 'userinfo',
                data: {
                  user: userInfo,
                  loginToken: token
                },
                success: function (res) {
                  wx.navigateBack({
                    delta: 1,
                    success: function(res){
                      wx.showToast({
                        title: '修改成功'
                      })
                    }
                  });
                }
              });
            } else if (res.data.type == 2) {
              console.error('修改失败');
              wx.showToast({
                title: '修改失败',
                image: '/images/cross.png'
              });
              /*
              wx.navigateBack({
                delta: 1
              });*/
            } else {
              console.error('修改参数错误');
              wx.showToast({
                title: '修改参数错误',
                image: '/images/cross.png'
              });
              /*
              wx.navigateBack({
                delta: 1
              });*/
            }

          }
        },
        fail: function (err) {
          console.error(err);
          wx.showToast({
            title: '修改失败',
            image: '/images/cross.png'
          });
          /*
          wx.navigateBack({
            delta: 1
          });*/
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
    login.default.getLoginData().then(loginData => {
      that.setData({
        token: loginData.loginToken,
        userInfo: loginData.user
      });
    }, err => {
      wx.navigateTo({
        url: '/pages/member/login/login',
        success: function(res){
          wx.showToast({
            title: '请先登录',
            image: '/images/cross.png'
          });
        }
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