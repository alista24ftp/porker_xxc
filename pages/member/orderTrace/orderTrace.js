// pages/member/orderTrace/orderTrace.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {failMsg, successMsg} = require('../../../utils/util.js');
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
    let orderId = options.orderid;
    this.setData({orderId});
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
    while(this.data.orderId === undefined){}
    let that = this;
    let orderId = that.data.orderId;
    getToken().then(token => {
      wx.request({
        url: ApiHost + '/xcc/home/getExpress',
        method: 'POST',
        data: {
          token,
          order_id: orderId
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              let trackingInfo = res.data.data[0];
              console.log(trackingInfo);
              that.setData({
                trackingInfo
              });
            } else {
              console.error('没有物流数据');
              that.setData({ trackingInfo: false });
            }
          } else {
            failMsg('获取物流失败');
            that.setData({ trackingInfo: false });
          }
        }
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