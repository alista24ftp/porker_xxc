// pages/member/register/register.js
const config = require('../../../config.js');
const validator = require('../../../utils/regValidate.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: true
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

  goBack: function(e){
    //console.log(getCurrentPages());
    if(getCurrentPages.length > 1){
      wx.navigateBack({
        delta: 1,
        success: function (res) {
          console.log(res);
        },
        fail: function (err) {
          console.error(err);
        }
      });
    }else{
      wx.switchTab({
        url: '/pages/index/index',
        fail: function(err){
          console.error(err);
        }
      })
    }
    
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
    if(validator.default.validatePhone(phoneNum)){
      wx.request({
        url: config.default.ApiHost + '/xcc/Login/verificationCode',
        method: 'POST',
        data: {
          user_phone: phoneNum
        },
        success: function (res) {
          if (res.data.code == 200) {
            //console.log(res.data.data);
            that.setData({
              verifyCode: res.data.data,
              user_phone: phoneNum,
              disabled: false
            });
          } else {
            console.error(res);
          }
        },
        fail: function (err) {
          console.error(err);
        }
      });
    }else{
      console.error('手机号不正确');
    }
    
  },

  formSubmit: function(e){
    //console.log(e);
    let inputInfo = e.detail.value;
    if(validator.default.validateSubmit(inputInfo.username, inputInfo.phone, inputInfo.verify, inputInfo.pwd) && inputInfo.verify == this.data.verifyCode){
      wx.request({
        url: config.default.ApiHost + '/xcc/Login/register',
        method: 'POST',
        data: {
          user_phone: inputInfo.phone,
          user_pwd: inputInfo.pwd,
          open_id: this.data.openId
        },
        success: function (res) {
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log('Registration success');
              let loginToken = res.data.data;
              let userInfo = res.data.user;
              userInfo.user_photo = config.default.ApiHost + userInfo.user_photo;
              //console.log(loginToken);
              //console.log(userInfo);
              wx.setStorage({
                key: 'userinfo',
                data: {
                  loginToken: loginToken,
                  user: userInfo
                },
                success: function (info) {
                  wx.reLaunch({
                    url: '../../center/center',
                    success: function (r) {
                      //console.log(r);
                    },
                    fail: function (err) {
                      console.error(err);
                    }
                  });
                },
                fail: function (err) {
                  console.error(err);
                }
              });
            } else if (res.data.type == 2) {
              console.error('注册失败');
            } else if (res.data.type == 3) {
              console.error('注册失败, 用户已存在');
            } else {
              console.error('注册失败, 用户名和密码不能为空');
            }
          } else {
            console.error('注册失败, 状态异常');
          }
        }
      });
    }else{
      console.error('注册验证错误, 请检查注册输入信息');
    }
  },

  formReset: function(e){
    // automatically reset all input fields
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