// pages/member/edit/editName/editName.js
const {ApiHost} = require('../../../../config.js');
const {getLoginData, goLogin} = require('../../../../utils/login.js');
const {validateUserName} = require('../../../../utils/regValidate.js');
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

  checkName: function(e){
    console.log(e);
    let newName = e.detail.value;
    let allowProceed = validateUserName(newName);
    
    this.setData({
      newName,
      allowProceed
    });
  },

  clearName: function (e) {
    console.log(e);
    this.setData({
      newName: '',
      allowProceed: false
    });
  },

  proceedEdit: function (e) {
    let {allowProceed, token, newName, userInfo} = this.data;
    if(allowProceed){
      wx.request({
        url: ApiHost + '/xcc/home/userUpdate',
        method: 'POST',
        data: {
          token: token,
          user_name: newName
        },
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              console.log('修改成功');
              userInfo.user_name = newName;
              wx.setStorage({
                key: 'userinfo',
                data: {
                  user: userInfo,
                  loginToken: token
                },
                success: function(res){
                  wx.navigateBack({
                    delta: 1,
                    success: function(res){
                      successMsg('修改成功');
                    }
                  });
                }
              });
            }else if(res.data.type == 2){
              console.error('修改失败');
              failMsg('修改失败');
              /*
              wx.navigateBack({
                delta: 1
              });
              */
            }else{
              console.error('修改参数错误');
              failMsg('修改参数错误');
              /*
              wx.navigateBack({
                delta: 1
              });*/
            }
            
          }
        },
        fail: function(err){
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
  onShow: function () {
    let that = this;
    getLoginData().then(loginData=>{
      that.setData({
        token: loginData.loginToken,
        userInfo: loginData.user
      });
    }, err=>{
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