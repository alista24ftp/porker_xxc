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
          wx.showToast({
            title: '无法返回前页面',
            image: '/images/cross.png'
          })
        }
      });
    }else{
      wx.switchTab({
        url: '/pages/index/index',
        fail: function(err){
          console.error(err);
          wx.showToast({
            title: '无法返回到主页',
            image: '/images/cross.png'
          })
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
            wx.showToast({
              title: '无法获取验证码',
              image: '/images/cross.png'
            });
          }
        },
        fail: function (err) {
          console.error(err);
          wx.showToast({
            title: '无法获取验证码',
            image: '/images/cross.png'
          })
        }
      });
    }else{
      console.error('手机号不正确');
      wx.showToast({
        title: '手机号不正确',
        image: '/images/cross.png'
      })
    }
    
  },

  formSubmit: function(e){
    //console.log(e);
    let inputInfo = e.detail.value;
    if(validator.default.validateSubmit(inputInfo.username, inputInfo.phone, inputInfo.verify, inputInfo.pwd) && inputInfo.verify == this.data.verifyCode){
      console.log(this.data.userImg);
      wx.request({
        url: config.default.ApiHost + '/xcc/Login/register',
        method: 'POST',
        data: {
          user_name: inputInfo.username,
          user_phone: inputInfo.phone,
          user_pwd: inputInfo.pwd,
          open_id: this.data.openId,
          unionId: this.data.unionId,
          user_photo: this.data.userImg
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              console.log('注册成功');
              console.log(res.data);
              let loginToken = res.data.data;
              let userInfo = res.data.user;
              let hostRegex = new RegExp('^'+config.default.ApiHost);
              userInfo.user_photo = hostRegex.test(userInfo.user_photo) ? userInfo.user_photo : config.default.ApiHost + userInfo.user_photo;
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
                      wx.showToast({
                        title: '注册成功',
                      })
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
              wx.showToast({
                title: '注册失败',
                image: '/images/cross.png'
              })
            } else if (res.data.type == 3) {
              console.error('注册失败, 用户已存在');
              wx.showToast({
                title: '用户已存在',
                image: '/images/cross.png'
              })
            } else {
              console.error('注册失败, 请检查注册信息');
              wx.showToast({
                title: '请检查注册信息',
                image: '/images/cross.png'
              })
            }
          } else {
            console.error('注册失败, 状态异常');
            wx.showToast({
              title: '注册状态异常',
              image: '/images/cross.png'
            })
          }
        }
      });
    }else{
      console.error('注册验证错误, 请检查注册输入信息');
      wx.showToast({
        title: '注册验证错误',
        image: '/images/cross.png'
      })
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