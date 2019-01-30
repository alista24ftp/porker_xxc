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
   * 
   * 根据获取的id设置相关订单列表的type
   * @param {number} options.id - 0 订单关闭, 1 未付款, 2 未发货, 3 未收货, 4 未评价, 5 交易完成, 6 已退款
   * 设置type为获取的id
   */
  onLoad: function (options) {
    this.setData({
      type: options.id
    });
  },

  deleteOrder: function(e){
    let orderSn = e.currentTarget.dataset.sn;
    getToken().then(token=>{
      wx.showModal({
        title: '确认删除此订单',
        content: '您确认要删除此订单吗?',
        confirmText: '是',
        cancelText: '否',
        success: function(res){
          if(res.confirm){
            wx.request({
              url: ApiHost + '/xcc/home/orderDel',
              method: 'POST',
              data: {
                token,
                order_sn: orderSn
              },
              success: function(res){
                console.log(res);
                if(res.data.code == 200){
                  if(res.data.type == 1){
                    console.log('订单删除成功');
                    wx.redirectTo({
                      url: '/pages/member/orderList/orderList?id=0',
                      success: function (res) {
                        successMsg('订单删除成功');
                      }
                    });
                  }else if(res.data.type == 2){
                    failMsg('删除订单失败');
                  }else{
                    failMsg('删除参数错误');
                  }
                }else{
                  failMsg('订单删除异常');
                }
              },
              fail: function(err){
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

  /**
   * 关闭订单:
   * 如果订单未付款, 点击取消时会取消指定订单
   * 
   * 接口 /xcc/home/orderClose: 取消订单
   * @param {number} order_id - 指定订单的订单id
   * @param {string} token - 登录令牌
   * @callback success: 取消操作完成
   * @return {number} res.data.code - 200 操作状态OK, 400 操作状态异常
   * @return {number} res.data.type - 1 取消成功, 2 取消失败
   * 成功即重新加载页面
   * @callback fail: 取消失败
   */
  cancelOrder: function(e){
    let orderId = e.currentTarget.dataset.id;
    getToken().then(token=>{
      wx.showModal({
        title: '确认取消此订单',
        content: '您确定要取消此订单吗?',
        confirmText: '是',
        cancelText: '否',
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
                    console.log('订单取消成功');
                    wx.redirectTo({
                      url: '/pages/member/orderList/orderList?id=1',
                      success: function(res){
                        successMsg('订单取消成功');
                      }
                    });
                  } else if (res.data.type == 2) {
                    console.error('订单取消失败');
                    failMsg('订单取消失败');
                  } else if (res.data.type == 3) {
                    console.error('订单取消参数错误');
                    failMsg('取消时参数错误');
                  }
                }else{
                  console.error('订单取消状态异常');
                  failMsg('订单取消异常');
                }
                
              },
              fail: function (err) {
                console.error(err);
                failMsg('订单取消失败');
              }
            });
          }
        }
      });
    }, err=>{
      goLogin();
    });
    
  },

  traceOrder: function(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/orderTrace/orderTrace?orderid=' + orderId
    });
  },

  /**
   * 去支付:
   * 根据指定订单付款
   * 
   * 接口 /xcc/order/unifiedorder: 提交订单
   * @param {string} token - 登录令牌
   * @callback success: 提交订单成功
   * @return {object} res - 支付参数
   * @callback fail: 提交订单失败
   * 
   * 支付接口 requestPayment:
   * @param {string} timeStamp - 时间戳 (使用res.data.data.timeStamp)
   * @param {string} nonceStr - 随机字符串 (使用res.data.data.nonceStr)
   * @param {string} package - prepay_id参数值 (使用res.data.data.package)
   * @param {string} signType - 签名算法 (使用res.data.data.signType)
   * @param {string} paySign - 签名 (使用res.data.data.paySign)
   * @callback success: 支付操作完成
   * @return {string} res.errMsg - 'requestPayment:ok' 支付成功
   * 支付成功则跳转回用户主页
   * @callback fail: 支付取消
   * 
   */
  pay: function (e) {
    let that = this;
    let order_sn = e.currentTarget.dataset.sn;
    let pay_id = e.currentTarget.dataset.id;
    if(pay_id!=5){
      failMsg('请在原渠道支付');
      return false;
    }
    getToken().then(token => {
      wx.request({
        url: ApiHost + '/xcc/order/againPay',
        method: 'POST',
        data: {
          token, order_sn
        },
        success: function (res) {
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: res.data.data.signType,
                paySign: res.data.data.paySign,
                success: function (res) {
                  console.log(res);
                  if (res.errMsg == "requestPayment:ok") {
                    //支付成功
                    wx.reLaunch({
                      url: '/pages/center/center',
                      success: function (res) {
                        successMsg('支付成功');
                      }
                    });
                  }
                },
                fail: function (err) {
                  //failMsg('支付取消');
                  console.error(err);
                }
              });
            }else if(res.data.type == 2){
              failMsg('订单超时');
            }else{
              failMsg('订单不存在');
            }
          }else{
            failMsg('支付状态异常');
          }
          
        },
        fail: function (err) {
          console.error(err);
          failMsg('下订单失败');
        }
      });
    }, err => {
      goLogin();
    });
  },

  /**
   * 确认收货:
   * 如果订单未收货, 点击去确认收货
   * 
   * 接口 /xcc/home/orderStatus: 确认订单收货
   * @param {number} order_id - 订单id
   * @param {string} token - 登录令牌
   * @callback success: 确认收货完成
   * @return {number} res.data.code - 200 确认收货OK, 400 确认收货状态异常
   * @return {number} res.data.type - 1 确认收货成功, 2 确认收货失败, 3 确认收货参数错误
   * 确认成功即重新加载此页面
   * @callback fail: 确认收货失败
   */
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

  /**
   * 去评价订单的商品
   * @property {number} e.currentTarget.dataset.id - 订单id
   * 打开并将订单id传递给订单评价页
   */
  comment: function(e){
    let orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/member/productComment/productComment?orderid=' + orderId
    });
  },

  refund: function(e){
    let orderSn = e.currentTarget.dataset.sn;
    wx.navigateTo({
      url: '/pages/member/apply/apply?ordersn=' + orderSn
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   * 
   * 根据onLoad设置的type加载相关订单列表
   * 
   * 接口 /xcc/home/stay: 获取相关订单列表
   * @param {number} type - 0 订单关闭, 1 未支付, 2 未发货, 3 未收货, 4 未评价, 5 交易成功, 6 已退款
   * @param {string} token - 登录令牌
   * @callback success: 获取完成
   * @return {number} res.data.code - 200 获取订单列表OK, 400 获取订单列表状态异常
   * @return {number} res.data.type - 1 获取订单成功, 2 获取订单为空, 3 获取订单参数错误
   * @return {array} res.data.data - 订单列表
   * 设置orderList 为订单列表或false当订单列表为空
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
              that.setData({orderList: false});
            }else{
              console.error('获取订单参数错误');
              failMsg('订单参数错误');
              that.setData({ orderList: false });
            }
          }else{
            console.error('获取订单状态异常');
            failMsg('订单状态异常');
            that.setData({ orderList: false });
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