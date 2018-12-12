// pages/basket/basket.js
const config = require('../../config.js');
const login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chosenNum: 0,
    total: 0
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
          url: config.default.ApiHost + '/xcc/Cart/cartList',
          method: 'POST',
          data: {
            token: userInfo.data.loginToken
          },
          success: function(res){
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                let cartList = res.data.data;
                let hostRegex = new RegExp('^' + config.default.ApiHost);
                cartList = cartList.map(cartItem=>{
                  cartItem.goods.goods_img = (hostRegex.test()) ? cartItem.goods.goods_img : config.default.ApiHost + cartItem.goods.goods_img;
                  cartItem.disableDecr = cartItem.cart_num > 0 ? 'less' : 'less dis';
                  return cartItem;
                });
                console.log(cartList);
                that.setData({
                  cartList: cartList
                });
              } else {
                console.error('没有购物车数据');
              }
            } else {
              console.error('购物车获取错误');
            }
          },
          fail: function(err){
            console.error(err);
          }
        });
      },
      fail: function(err){
        login.default.login().then(loginState=>{
          let loginToken = loginState.loginToken;
          wx.request({
            url: config.default.ApiHost + '/xcc/Cart/cartList',
            method: 'POST',
            data: {
              token: loginToken
            },
            success: function(res){
              if(res.data.code == 200){
                if(res.data.type == 1){
                  let cartList = res.data.data;
                  let hostRegex = new RegExp('^' + config.default.ApiHost);
                  cartList = cartList.map(cartItem => {
                    cartItem.goods.goods_img = (hostRegex.test()) ? cartItem.goods.goods_img : config.default.ApiHost + cartItem.goods.goods_img;
                    return cartItem;
                  });
                  console.log(cartList);
                  that.setData({
                    cartList: cartList
                  });
                }else{
                  console.error('没有购物车数据');
                }
              }else{
                console.error('购物车获取错误');
              }
            },
            fail: function(err){
              console.error(err);
            }
          });
        }, err=>{
          console.error(err);
        });
      }
    });
  },

  increase: function(e){
    console.log(e);
    let cartList = this.data.cartList;
    let index = e.currentTarget.dataset.index;
    if(cartList && cartList[index] && (cartList[index].cart_num !== undefined)){
      if(!isNaN(cartList[index].cart_num) && cartList[index].cart_num >= 0){
        cartList[index].cart_num = Number(cartList[index].cart_num) + 1;
        cartList[index].disableDecr = 'less';
        this.setData({
          cartList: cartList
        });
      }else{
        cartList[index].cart_num = 0;
        cartList[index].disableDecr = 'less dis';
        this.setData({
          cartList: cartList
        });
      }
      console.log(this.data.cartList);
    }
  },

  decrease: function(e){
    console.log(e);
    let cartList = this.data.cartList;
    let index = e.currentTarget.dataset.index;
    if (cartList && cartList[index] && (cartList[index].disableDecr == 'less') && (cartList[index].cart_num !== undefined)) {
      if (!isNaN(cartList[index].cart_num) && cartList[index].cart_num > 0) {
        cartList[index].cart_num = Number(cartList[index].cart_num) - 1;
        cartList[index].disableDecr = cartList[index].cart_num > 0 ? 'less' : 'less dis';
        this.setData({
          cartList: cartList
        });
      } else {
        cartList[index].cart_num = 0;
        cartList[index].disableDecr = 'less dis';
        this.setData({
          cartList: cartList
        });
      }
      console.log(this.data.cartList);
    }
  },

  inputNum: function(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let newQuantity = e.detail.value;
    let cartList = this.data.cartList;
    if(cartList[index].cart_num !== undefined){
      if(!isNaN(newQuantity) && newQuantity >= 0){
        cartList[index].cart_num = newQuantity;
        cartList[index].disableDecr = newQuantity > 0 ? 'less' : 'less dis';
        this.setData({
          cartList: cartList
        });
      }else{
        cartList[index].cart_num = 0;
        cartList[index].disableDecr = 'less dis';
        this.setData({
          cartList: cartList
        });
      }
      console.log(this.data.cartList);
    }
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