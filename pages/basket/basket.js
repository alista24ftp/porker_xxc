// pages/basket/basket.js
const config = require('../../config.js');
const login = require('../../utils/login.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chosenNum: 0,
    total: 0,
    chooseAll: 'icon icon-nochecked-g ion-ios-circle-outline'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  increase: function(e){
    console.log(e);
    let that = this;
    let {cartList, total} = this.data;
    let index = e.currentTarget.dataset.index;
    if(cartList && cartList[index] && (cartList[index].cart_num !== undefined)){
      if(!isNaN(cartList[index].cart_num) && cartList[index].cart_num >= 0){
        cartList[index].cart_num = Number(cartList[index].cart_num) + 1;
        cartList[index].disableDecr = 'less';
        if (cartList[index].checked == 'icon icon-ischecked-g ion-checkmark-circled') {
          total = (Number(total) + Number(cartList[index].goods.goods_newprice)).toFixed(2);
        }
        wx.request({
          url: config.default.ApiHost + '/xcc/cart/goodsAdd',
          method: 'POST',
          data: {
            token: that.data.token,
            goods_id: cartList[index].goods_id,
            type: 1
          },
          success: function(res){
            if(res.data.code == 200){
              if(res.data.type == 1){
                that.setData({
                  cartList, total
                });
              }else if(res.data.type == 2){
                console.error('无法增加商品数量');
              }else{
                console.error('商品参数错误');
              }
            }else{
              console.error('商品增加状态异常');
            }
          },
          fail: function(err){
            console.error(err);

          }
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
    let that = this;
    let {cartList, total} = this.data;
    let index = e.currentTarget.dataset.index;
    if (cartList && cartList[index] && (cartList[index].disableDecr == 'less') && (cartList[index].cart_num !== undefined)) {
      if (!isNaN(cartList[index].cart_num) && cartList[index].cart_num > 0) {
        cartList[index].cart_num = Number(cartList[index].cart_num) - 1;
        cartList[index].disableDecr = cartList[index].cart_num > 0 ? 'less' : 'less dis';
        if (cartList[index].checked == 'icon icon-ischecked-g ion-checkmark-circled') {
          total = (Number(total) - Number(cartList[index].goods.goods_newprice)).toFixed(2);
        }
        wx.request({
          url: config.default.ApiHost + '/xcc/cart/goodsAdd',
          method: 'POST',
          data: {
            token: that.data.token,
            goods_id: cartList[index].goods_id,
            type: 2
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                that.setData({
                  cartList, total
                });
              } else if (res.data.type == 2) {
                console.error('无法减少商品数量');
              } else {
                console.error('商品参数错误');
              }
            } else {
              console.error('商品减少状态异常');
            }
          },
          fail: function (err) {
            console.error(err);

          }
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
    let {cartList, total} = this.data;
    if(cartList[index].cart_num !== undefined){
      if(/^[0-9]+$/.test(newQuantity) && !isNaN(newQuantity) && newQuantity >= 0){
        let oldQuantity = cartList[index].cart_num;
        cartList[index].cart_num = newQuantity;
        cartList[index].disableDecr = newQuantity > 0 ? 'less' : 'less dis';
        if (cartList[index].checked == 'icon icon-ischecked-g ion-checkmark-circled') {
          total = (Number(total) + Number(cartList[index].goods.goods_newprice) * (Number(newQuantity) - Number(oldQuantity))).toFixed(2);
        }
        this.setData({
          cartList, total
        });
      }else{
        let oldQuantity = cartList[index].cart_num;
        if (cartList[index].checked == 'icon icon-ischecked-g ion-checkmark-circled') {
          total = (Number(total) - Number(cartList[index].goods.goods_newprice) * Number(oldQuantity)).toFixed(2);
        }
        cartList[index].cart_num = 0;
        cartList[index].disableDecr = 'less dis';
        this.setData({
          cartList, total
        });
      }
      console.log(this.data.cartList);
    }
  },

  toggleSelect: function(e){
    let index = e.currentTarget.dataset.index;
    let {cartList, total, chosenNum} = this.data;
    if (cartList[index].checked == 'icon icon-nochecked-g ion-ios-circle-outline'){
      cartList[index].checked = 'icon icon-ischecked-g ion-checkmark-circled';
      chosenNum = Number(chosenNum) + 1;
      total = (Number(total) + (Number(cartList[index].cart_num) * Number(cartList[index].goods.goods_newprice))).toFixed(2);
    }else{
      cartList[index].checked = 'icon icon-nochecked-g ion-ios-circle-outline';
      chosenNum = Number(chosenNum) - 1;
      total = (Number(total) - (Number(cartList[index].cart_num) * Number(cartList[index].goods.goods_newprice))).toFixed(2);
    }
    
    this.setData({
      cartList, chosenNum, total
    });
  },

  toggleAll: function(e){
    let {chooseAll, cartList, total, chosenNum} = this.data;
    if(cartList && cartList.length > 0){
      if (chooseAll == 'icon icon-nochecked-g ion-ios-circle-outline') {
        chooseAll = 'icon icon-ischecked-g ion-checkmark-circled';
        total = (cartList.reduce((acc, item) => Number(acc) + (Number(item.cart_num) * Number(item.goods.goods_newprice)), 0)).toFixed(2);
        chosenNum = cartList.length;
      } else {
        chooseAll = 'icon icon-nochecked-g ion-ios-circle-outline';
        total = 0;
        chosenNum = 0;
      }
      cartList = cartList.map(item => {
        item.checked = chooseAll;
        return item;
      });

      this.setData({
        cartList, chooseAll, total, chosenNum
      });
    }
    
  },

  delItem: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '确认删除购物车商品',
      content: '您确定要删除购物车的商品吗?',
      confirmText: '删除',
      cancelText: '取消',
      success: function(res){
        if(res.confirm){
          wx.request({
            url: config.default.ApiHost + '/xcc/cart/del',
            method: 'POST',
            data: {
              token: that.data.token,
              goods_id: that.data.cartList[index].goods_id
            },
            success: function(res){
              if(res.data.code == 200){
                if(res.data.type == 1){
                  console.log('删除成功');
                  wx.reLaunch({
                    url: './basket',
                    success: function(r){
                      console.log(r);
                    },
                    fail: function(err){
                      console.error(err);
                    }
                  })
                }else{
                  console.error('删除失败');
                }
              }else{
                console.error('删除操作异常');
              }
            },
            fail: function(err){
              console.error(err);
            }
          });
        }
      }
    })
  },

  delAll: function(e){
    let that = this;
    wx.showModal({
      title: '确认清空购物车商品',
      content: '您确定要清空购物车吗?',
      confirmText: '清空',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: config.default.ApiHost + '/xcc/cart/del',
            method: 'POST',
            data: {
              token: that.data.token
            },
            success: function (res) {
              if (res.data.code == 200) {
                if (res.data.type == 1) {
                  console.log('清空成功');
                  wx.reLaunch({
                    url: './basket',
                    success: function (r) {
                      console.log(r);
                    },
                    fail: function (err) {
                      console.error(err);
                    }
                  });
                } else {
                  console.error('清空失败');
                }
              } else {
                console.error('清空操作异常');
              }
            },
            fail: function (err) {
              console.error(err);
            }
          });
        }
      }
    })
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
    let that = this;
    wx.getStorage({
      key: 'userinfo',
      success: function (userInfo) {
        wx.request({
          url: config.default.ApiHost + '/xcc/Cart/cartList',
          method: 'POST',
          data: {
            token: userInfo.data.loginToken
          },
          success: function (res) {
            if (res.data.code == 200) {
              if (res.data.type == 1) {
                let cartList = res.data.data;
                let hostRegex = new RegExp('^' + config.default.ApiHost);
                cartList = cartList.map(cartItem => {
                  cartItem.goods.goods_img = (hostRegex.test()) ? cartItem.goods.goods_img : config.default.ApiHost + cartItem.goods.goods_img;
                  cartItem.disableDecr = cartItem.cart_num > 0 ? 'less' : 'less dis';
                  cartItem.checked = 'icon icon-nochecked-g ion-ios-circle-outline';
                  return cartItem;
                });
                console.log(cartList);
                that.setData({
                  cartList: cartList,
                  token: userInfo.data.loginToken
                });
              } else {
                console.error('没有购物车数据');
              }
            } else {
              console.error('购物车获取错误');
            }
          },
          fail: function (err) {
            console.error(err);
          }
        });
      },
      fail: function (err) {
        wx.navigateTo({
          url: '../member/login/login'
        });
      }
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