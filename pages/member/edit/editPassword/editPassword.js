// pages/member/edit/editPassword/editPassword.js
const {ApiHost} = require('../../../../config.js');
const {getLoginData} = require('../../../../utils/login.js');
const {validatePassword} = require('../../../../utils/regValidate.js');
const {successMsg, failMsg} = require('../../../../utils/util.js');
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

  checkPassword: function (e) {
    console.log(e);
    let newPassword = e.detail.value;
    let allowProceed = validatePassword(newPassword);

    this.setData({
      newPassword,
      allowProceed
    });
  },

  clearPassword: function (e) {
    console.log(e);
    this.setData({
      newPassword: '',
      allowProceed: false
    });
  },

  proceedEdit: function (e) {
    let { allowProceed, token, newPassword, userInfo } = this.data;
    if (allowProceed) {
      wx.request({
        url: ApiHost + '/xcc/home/userUpdate',
        method: 'POST',
        data: {
          token: token,
          user_pwd: newPassword
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log('修改成功');
              //userInfo.user_pwd = newPassword;
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
                      successMsg('修改成功');
                    }
                  });
                }
              });
            } else if (res.data.type == 2) {
              console.error('修改失败');
              failMsg('修改失败');
              /*
              wx.navigateBack({
                delta: 1
              });*/
            } else {
              console.error('修改参数错误');
              failMsg('修改参数错误');
              /*
              wx.navigateBack({
                delta: 1
              });*/
            }

          }
        },
        fail: function (err) {
          console.error(err);
          failMsg('修改失败');
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
  onShow: function (options) {
    let that = this;
    getLoginData().then(loginData => {
      that.setData({
        token: loginData.loginToken,
        userInfo: loginData.user
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