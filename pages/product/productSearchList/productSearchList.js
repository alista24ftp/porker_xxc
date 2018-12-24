// pages/product/productSearchList/productSearchList.js
const config = require('../../../config.js');
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
    let hostRegex = new RegExp('^' + config.default.ApiHost);
    let keyword = options.keyword;
    wx.request({
      url: config.default.ApiHost + '/xcc/index/search',
      method: 'POST',
      data: {
        key: keyword
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          if (res.data.type == 1) {
            let products = res.data.data;
            products = products.map(prod=>{
              prod.goods_img = hostRegex.test(prod.goods_img) ? prod.goods_img : config.default.ApiHost + prod.goods_img;
              return prod;
            });
            that.setData({
              title: '相关商品',
              products: products
            });
          } else if (res.data.type == 2) {
            console.error('未找到任何相关商品');
            that.setData({
              title: '未找到任何商品'
            });
          } else {
            console.error('商品关键词输入错误');
            wx.showToast({
              title: '关键词输入错误',
              image: '/images/cross.png'
            })
            that.setData({
              title: '未找到任何商品'
            });
          }
        } else {
          console.error('获取商品状态异常');
          wx.showToast({
            title: '取商品状态异常',
            image: '/images/cross.png'
          });
          that.setData({
            title: '未找到任何商品'
          });
        }
      },
      fail: function (err) {
        console.error(err);
        wx.showToast({
          title: '获取商品错误',
          image: '/images/cross.png'
        })
        that.setData({
          title: '未找到任何商品'
        });
      }
    });
  },

  chooseProduct: function(e){
    let prodId = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/product/productDetail/productDetail?pid=' + prodId
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