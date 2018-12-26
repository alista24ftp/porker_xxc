// pages/member/register/register.js
const {ApiHost} = require('../../../config.js');
const {validatePhone, validateSubmit} = require('../../../utils/regValidate.js');
const {formatImg, successMsg, failMsg} = require('../../../utils/util.js');
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
    let unionId = options.unionid;
    let userImg = options.userimg;
    //console.log(openId);
    console.log(userImg);
    this.setData({
      openId: openId,
      unionId: unionId,
      userImg: userImg
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
          failMsg('无法返回前页面');
        }
      });
    }else{
      wx.switchTab({
        url: '/pages/index/index',
        fail: function(err){
          console.error(err);
          failMsg('无法返回到主页');
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
    if(validatePhone(phoneNum)){
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
            that.setData({
              verifyCode: res.data.data,
              user_phone: phoneNum,
              disabled: false
            });
          } else {
            console.error(res);
            failMsg('无法获取验证码');
          }
        },
        fail: function (err) {
          console.error(err);
          failMsg('无法获取验证码');
        }
      });
    }else{
      console.error('手机号不正确');
      failMsg('手机号不正确');
    }
    
  },

  formSubmit: function(e){
    //console.log(e);
    let inputInfo = e.detail.value;
    let that = this;
    if(validateSubmit(inputInfo.username, inputInfo.phone, inputInfo.verify, inputInfo.pwd) && inputInfo.verify == that.data.verifyCode){
      console.log(that.data.userImg);
      wx.request({
        url: ApiHost + '/xcc/Login/register',
        method: 'POST',
        data: {
          user_name: inputInfo.username,
          user_phone: inputInfo.phone,
          user_pwd: inputInfo.pwd,
          open_id: that.data.openId,
          unionId: that.data.unionId,
          user_photo: that.data.userImg
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log('注册成功');
              console.log(res.data);
              let loginToken = res.data.data;
              let userInfo = res.data.user;
              userInfo.user_photo = formatImg(userInfo.user_photo);
              //console.log(loginToken);
              //console.log(userInfo);
              wx.setStorage({
                key: 'userinfo',
                data: {
                  loginToken: loginToken,
                  user: userInfo
                },
                success: function (info) {
                  wx.navigateBack({
                    delta: 2,
                    success: function(){
                      successMsg('注册成功');
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
              failMsg('注册失败');
            } else if (res.data.type == 3) {
              console.error('注册失败, 用户已存在');
              failMsg('用户已存在');
            } else {
              console.error('注册失败, 请检查注册信息');
              failMsg('请检查注册信息');
            }
          } else {
            console.error('注册失败, 状态异常');
            failMsg('注册状态异常');
          }
        }
      });
    }else{
      console.error('注册验证错误, 请检查注册输入信息');
      failMsg('注册验证错误');
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