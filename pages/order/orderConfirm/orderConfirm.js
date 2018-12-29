// pages/order/orderConfirm/orderConfirm.js
const {ApiHost} = require('../../../config.js');
const {successMsg, failMsg} = require('../../../utils/util.js');
const {getToken, goLogin} = require('../../../utils/login.js');
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
    let type = options.type;
    if(type == 1){ // 购物车下单
      let products = JSON.parse(options.items);
      console.log(products);
      this.setData({type, products});
    }else{ // 直接购买
      let product = JSON.parse(options.item);
      console.log(product);
      this.setData({type, product});
    }
  },

  goBack: function(e){
    wx.navigateBack({
      delta: 1
    });
  },

  goHome: function(e){
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  inputMsg: function(e){
    let msg = e.detail.value;
    this.setData({
      msg: msg
    });
  },

  editAddr: function(e){
    wx.navigateTo({
      url: '/pages/member/receiveList/receiveList?sel=1'
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
    console.log(this.data.addrId);
    let that = this;
    
    getToken().then(token=>{
      let postData = {
        type: that.data.type,
        token,
      };
      if (that.data.type == 1) {
        postData.data = that.data.products.map(product=>product.cart_id).join(',');
      } else {
        postData.goods_id = that.data.product.goods_id;
        postData.sku_id = that.data.product.sku_id;
        postData.num = that.data.product.quantity;
      }

      if(that.data.addrId !== undefined){
        postData.address_id = that.data.addrId;
      }

      wx.request({
        url: ApiHost + '/xcc/order/orderDetail',
        method: 'POST',
        data: postData,
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 3){
              failMsg('订单参数错误');
            }else{
              let {address, prices, totals} = res.data;
              let stateData = {
                subTotal: Number(prices).toFixed(2),
                shippingFee: Number(totals).toFixed(2),
                totalPrice: (Number(prices) + Number(totals)).toFixed(2)
              };
              let addrId;
              if(address !== null){
                stateData.address = address.add_name + ', ' + address.add_phone + ', ' + address.province + '-' + address.city + '-' + address.dist + ', ' + address.add_street;
                stateData.addrId = address.add_id;
              }else{
                stateData.address = false;
              }
              
              that.setData(stateData); 
            }
          }else{
            failMsg('获取订单错误');
          }
        },
        fail: function(err){
          console.error(err);
        }
      });
    }, err=>{
      goLogin();
    });
  },

  pay: function (e) {
    let that = this;
    if(that.data.addrId !== undefined){
      getToken().then(token => {
        let type = that.data.type == 1 ? 2 : 1;
        let add_id = that.data.addrId;
        let orderData = {
          type,
          add_id,
          token
        };
        if(type == 1){
          orderData.goods_id = that.data.product.goods_id;
          orderData.sku_id = that.data.product.sku_id;
          orderData.num = that.data.product.quantity;
        }else{
          orderData.cart_id = that.data.products.map(product => product.cart_id).join(',');
        }
        wx.request({
          url: ApiHost + '/xcc/order/unifiedorder',
          method: 'POST',
          data: orderData,
          success: function (res) {
            console.log(res);
            if(res.data.code == 200){
              if(res.data.type == 1){
                successMsg('下单成功');
                wx.requestPayment(
                  {
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
                      wx.redirectTo({
                        url: '/pages/member/orderList/orderList?id=1',
                        success: function (res) {
                          failMsg('支付取消');
                        }
                      });

                      console.error(err);
                    }
                  })
              }else if(res.data.type == 2){
                failMsg('下单失败');
              }else{
                failMsg('下单参数错误');
              }
            }else{
              failMsg('下单状态异常');
            }
            
          },
          fail: function (err) {
            console.error(err);
            wx.redirectTo({
              url: '/pages/member/orderList/orderList?id=1',
              success: function (res) {
                failMsg('下订单失败');
              }
            });
          }
        });
      }, err => {
        goLogin();
      });
    }else{
      failMsg('请选择收货地址');
    }
    
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