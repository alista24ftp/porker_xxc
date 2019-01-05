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
   * 
   * 根据获取的购买类型type设置商品基本信息
   * @param {number} options.type - 1 购物车下单, 2 直接购买
   * 购物车下单:
   * @param {string} options.items - 多个商品以及基本信息(JSON字符串)
   * 设置products为解析的options.items
   * 直接购买:
   * @param {string} options.item - 单个商品基本信息(JSON字符串)
   * 设置product为解析的options.item
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

  /**
   * 返回之前页面
   */
  goBack: function(e){
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 跳转到主页面
   */
  goHome: function(e){
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * 输入买家留言
   * @param {string} e.detail.value - 留言
   * 设置msg为买家输入的留言
   */
  inputMsg: function(e){
    let msg = e.detail.value;
    this.setData({
      msg: msg
    });
  },

  /**
   * 去选择或修改收货地址
   */
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
   * 
   * 显示下单的详细信息, 包括运费, 规格, 数量, 总计, 以及收货地址
   * 
   * 接口 /xcc/order/orderDetail: 获取下单的详细信息
   * @param {object} postData - 传递给接口的订单参数
   * @property {string} postData.token - 登录令牌
   * @property {number} postData.type - 1 购物车下单, 2 直接购买
   * @property {number} postData.address_id - 收货地址的地址id, 或者使用默认地址(以及地址不存在)不传此参数
   * 购物车下单:
   * @property {string} postData.data - 所有商品的购物车id(用逗号连起来)
   * 直接购买:
   * @property {number} postData.goods_id - 商品id
   * @property {number} postData.sku_id - 规格id
   * @property {number} postData.num - 购买数量
   * 
   * @callback success: 订单获取操作完成
   * @return {number} res.data.code - 200 获取订单OK, 400 获取订单异常
   * @return {number} res.data.type - 3 订单参数错误, else 订单获取成功
   * @return {decimal} res.data.prices - 不包括运费的商品总和
   * @return {decimal} res.data.totals - 运费
   * @return {object} res.data.address - 用户的选择地址信息, 或者默认地址(没选择时), 或者null当用户没有任何收货地址
   * @property {string} res.data.address.add_name - 联系人名
   * @property {string} res.data.address.add_phone - 收货地址电话
   * @property {string} res.data.address.add_province - 收货地址省
   * @property {string} res.data.address.add_city - 收货地址市
   * @property {string} res.data.address.add_dist - 收货地址区
   * @property {string} res.data.address.add_street - 收货地址名称
   * 设置subTotal为不包括运费的商品总和, shippingFee为运费, totalPrice为总计, address为收货地址或false当没有收货地址时, addrId为收货地址id或不设置
   * 
   * @callback fail: 订单获取失败
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
          failMsg('获取订单失败');
        }
      });
    }, err=>{
      goLogin();
    });
  },

  /**
   * 支付此订单
   * 
   * 接口 /xcc/order/unifiedorder: 下订单并支付
   * @param {object} orderData - 订单参数
   * @property {number} orderData.type - 1 购物车下单, 2 直接购买 
   * @property {number} orderData.address_id - 收货地址id
   * @property {string} orderData.token - 登录令牌
   * 直接购买:
   * @property {number} orderData.goods_id - 商品id
   * @property {number} orderData.sku_id - 规格id
   * @property {number} orderData.num - 购买数量
   * 购物车下单:
   * @property {string} orderData.data - 所有商品的购物车id(用逗号连起来)
   * 
   * @callback success: 下单完成
   * @return {number} res.data.code - 200 下单OK, 400 下单异常
   * @return {number} res.data.type - 1 下单成功, 2 下单失败, 3 下单参数错误, 5 商品库存不足
   * @return {object} res.data.data - 支付参数
   * @callback fail: 下单失败, 直接跳转到未支付订单列表页
   * 
   * 支付接口 requestPayment:
   * @param {string} timeStamp - 时间戳 (使用res.data.data.timeStamp)
   * @param {string} nonceStr - 随机字符串 (使用res.data.data.nonceStr)
   * @param {string} package - prepay_id参数值 (使用res.data.data.package)
   * @param {string} signType - 签名算法 (使用res.data.data.signType)
   * @param {string} paySign - 签名 (使用res.data.data.paySign)
   * @callback success: 支付操作完成
   * @return {string} res.errMsg - 'requestPayment:ok' 支付成功
   * 支付成功则跳转至用户中心页
   * @callback fail: 支付取消
   * 支付取消则跳转至未支付订单列表页
   */
  pay: function (e) {
    let that = this;
    if(that.data.addrId !== undefined){
      getToken().then(token => {
        let type = that.data.type;
        let address_id = that.data.addrId;
        let orderData = {
          type,
          address_id,
          token
        };
        if(type == 2){
          orderData.goods_id = that.data.product.goods_id;
          orderData.sku_id = that.data.product.sku_id;
          orderData.num = that.data.product.quantity;
        }else{
          orderData.data = that.data.products.map(product => product.cart_id).join(',');
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
                          //failMsg('支付取消');
                        }
                      });

                      console.error(err);
                    }
                  })
              }else if(res.data.type == 2){
                failMsg('下单失败');
              }else if(res.data.type == 3){
                failMsg('下单参数错误');
              }else{ // type == 5
                failMsg('商品库存不足');
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