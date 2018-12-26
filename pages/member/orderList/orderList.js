// pages/member/orderList/orderList.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {formatImg, successMsg, failMsg} = require('../../../utils/util.js');
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
    this.setData({
      type: options.id
    });
  },

  cancelOrder: function(e){
    let orderId = e.currentTarget.dataset.id;
    getToken().then(token=>{
      wx.showModal({
        title: '确认删除此订单',
        content: '您确定要删除此订单吗?',
        confirmText: '删除',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: ApiHost + '/xcc/home/orderClose',
              method: 'POST',
              data: {
                token: token,
                order_id: orderId
              },
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  if (res.data.type == 1) {
                    console.log('订单删除成功');
                    wx.redirectTo({
                      url: '/pages/member/orderList/orderList?id=1',
                      success: function(res){
                        successMsg('订单删除成功');
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('订单删除失败');
                    failMsg('订单删除失败');
                  } else if (res.data.type == 3) {
                    console.error('订单删除参数错误');
                    failMsg('删除参数错误');
                  }
                }else{
                  console.error('订单删除状态异常');
                  failMsg('订单删除异常');
                }
                
              },
              fail: function (err) {
                console.error(err);
                failMsg('订单删除失败');
              }
            });
          }
        }
      });
    }, err=>{
      goLogin();
    });
    
  },

  orderDetail: function(e){
    wx.navigateTo({
      url: '/pages/member/orderDetail/orderDetail'
    });
  },

  confirmRecv: function(e){
    let orderId = e.currentTarget.dataset.id;
    getToken().then(token=>{
      wx.showModal({
        title: '确认收货',
        content: '您要确认收货吗?',
        confirmText: '确认',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: ApiHost + '/xcc/home/orderStatus',
              method: 'POST',
              data: {
                token: token,
                order_id: orderId
              },
              success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                  if (res.data.type == 1) {
                    console.log('确认收货成功');
                    wx.redirectTo({
                      url: '/pages/member/orderList/orderList?id=3',
                      success: function(res){
                        successMsg('确认收货成功');
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('确认收货失败');
                    failMsg('确认收货失败');
                  } else if (res.data.type == 3) {
                    console.error('确认收货参数错误');
                    failMsg('确认参数错误');
                  }
                } else {
                  console.error('确认收货状态异常');
                  failMsg('确认收货异常');
                }

              },
              fail: function (err) {
                console.error(err);
                failMsg('确认收货失败');
              }
            });
          }
        }
      });
    }, err=>{
      goLogin();
    });
    
  },

  comment: function(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/productComment/productComment?orderid=' + orderId
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
    let type = this.data.type;
    let that = this;
    getToken().then(token=>{
      wx.request({
        url: ApiHost + '/xcc/home/stay',
        method: 'POST',
        data: {token, type},
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              let list = res.data.data;
              list = list.map(order=>{
                order.data = order.data.map(product=>{
                  product.goods_img = formatImg(product.goods_img);
                  return product;
                });
                return order;
              });
              console.log(list);
              that.setData({
                orderList: list
              });
            }else if(res.data.type == 2){
              console.error('没有任何订单信息');
              that.setData({orderList: undefined});
            }else{
              console.error('获取订单参数错误');
              failMsg('订单参数错误');
              that.setData({ orderList: undefined });
            }
          }else{
            console.error('获取订单状态异常');
            failMsg('订单状态异常');
            that.setData({ orderList: undefined });
          }
        }
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