// pages/member/receiveList/receiveList.js
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
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function(userInfo){
        wx.request({
          url: config.default.ApiHost + '/xcc/Address/getList',
          method: 'POST',
          data: {
            token: userInfo.data.loginToken
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                console.log(res.data.data);
                that.setData({
                  addressList: res.data.data,
                  token: userInfo.data.loginToken
                });
              } else {
                console.error('没有用户地址信息');
                that.setData({
                  addressList: []
                });
              }
            } else {
              console.error('错误获取用户地址信息');
            }
          },
          fail: function (err) {
            console.error(err);
          }
        });
      },
      fail: function(err){
        login.default.login().then(loginState=>{
          let loginToken = loginState.loginToken;
          wx.request({
            url: config.default.ApiHost + '/xcc/Address/getList',
            method: 'POST',
            data: {
              token: loginToken
            },
            success: function (res) {
              if(res.data.code == 200){
                if(res.data.type == 1){
                  console.log(res.data.data);
                  that.setData({
                    addressList: res.data.data,
                    token: loginToken
                  });
                }else{
                  console.error('没有用户地址信息');
                  that.setData({
                    addressList: []
                  });
                }
              }else{
                console.error('错误获取用户地址信息');
              }
            },
            fail: function (err) {
              console.error(err);
            }
          });
        }, err=>{
          console.error(err);
        });
      }
    });
    
  },

  editAddress: function(e){
    let index = e.currentTarget.dataset.index;
    let addr = JSON.stringify(this.data.addressList[index]);
    let token = this.data.token;
    wx.navigateTo({
      url: '../addressAdd/addressAdd?addr=' + addr + '&token=' + token
    });
  },

  addAddress: function(e){
    let token = this.data.token;
    wx.navigateTo({
      url: '../addressAdd/addressAdd?token=' + token
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