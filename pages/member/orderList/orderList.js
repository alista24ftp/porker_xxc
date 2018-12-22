// pages/member/orderList/orderList.js
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
    this.setData({
      type: options.id
    });
  },

  cancelOrder: function(e){
    let orderId = e.currentTarget.dataset.id;
    login.default.getToken().then(token=>{
      wx.showModal({
        title: '确认删除此订单',
        content: '您确定要删除此订单吗?',
        confirmText: '删除',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: config.default.ApiHost + '/xcc/home/orderClose',
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
                      url: './orderList?id=1',
                      success: function(res){
                        wx.showToast({
                          title: '订单删除成功',
                        })
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('订单删除失败');
                    wx.showToast({
                      title: '订单删除失败',
                      image: '/images/cross.png'
                    })
                  } else if (res.data.type == 3) {
                    console.error('订单删除参数错误');
                    wx.showToast({
                      title: '删除参数错误',
                      image: '/images/cross.png'
                    })
                  }
                }else{
                  console.error('订单删除状态异常');
                  wx.showToast({
                    title: '订单删除异常',
                    image: '/images/cross.png'
                  })
                }
                
              },
              fail: function (err) {
                console.error(err);
                wx.showToast({
                  title: '订单删除失败',
                  image: '/images/cross.png'
                })
              }
            });
          }
        }
      });
    }, err=>{
      wx.navigateTo({
        url: '/pages/member/login/login',
        success: function(res){
          wx.showToast({
            title: '请先登录',
            image: '/images/cross.png'
          })
        }
      });
    });
    
  },

  orderDetail: function(e){
    wx.navigateTo({
      url: '/pages/member/orderDetail/orderDetail'
    });
  },

  confirmRecv: function(e){
    let orderId = e.currentTarget.dataset.id;
    login.default.getToken().then(token=>{
      wx.showModal({
        title: '确认收货',
        content: '您要确认收货吗?',
        confirmText: '确认',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: config.default.ApiHost + '/xcc/home/orderStatus',
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
                      url: './orderList?id=3',
                      success: function(res){
                        wx.showToast({
                          title: '确认收货成功',
                        })
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('确认收货失败');
                    wx.showToast({
                      title: '确认收货失败',
                      image: '/images/cross.png'
                    })
                  } else if (res.data.type == 3) {
                    console.error('确认收货参数错误');
                    wx.showToast({
                      title: '确认参数错误',
                      image: '/images/cross.png'
                    })
                  }
                } else {
                  console.error('确认收货状态异常');
                  wx.showToast({
                    title: '确认收货异常',
                    image: '/images/cross.png'
                  })
                }

              },
              fail: function (err) {
                console.error(err);
                wx.showToast({
                  title: '确认收货失败',
                  image: '/images/cross.png'
                })
              }
            });
          }
        }
      });
    }, err=>{
      wx.navigateTo({
        url: '/pages/member/login/login',
        success: function(res){
          wx.showToast({
            title: '请先登录',
            image: '/images/cross.png'
          })
        }
      });
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
    login.default.getToken().then(token=>{
      wx.request({
        url: config.default.ApiHost + '/xcc/home/stay',
        method: 'POST',
        data: {token, type},
        success: function(res){
          if(res.data.code == 200){
            if(res.data.type == 1){
              let list = res.data.data;
              let hostRegex = new RegExp('^'+config.default.ApiHost);
              list = list.map(order=>{
                order.data = order.data.map(product=>{
                  product.goods_img = hostRegex.test(product.goods_img) ? product.goods_img : config.default.ApiHost + product.goods_img;
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
              that.setData({ orderList: undefined });
            }
          }else{
            console.error('获取订单状态异常');
            that.setData({ orderList: undefined });
          }
        }
      });
    }, err=>{
      wx.navigateTo({
        url: '/pages/member/login/login'
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