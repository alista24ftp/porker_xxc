// pages/product/productList/productList.js
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
    console.log(options.cid);
    let cid = options.cid;
    let that = this;
    wx.request({
      url: config.default.ApiHost + '/xcc/Index/goodsCatList',
      method: 'POST',
      data: {
        cat_id: cid
      },
      success: function(res){
        if(res.data.code == 200){
          let productList = res.data.goodsList;
          let hostRegex = new RegExp('^'+config.default.ApiHost);
          productList = productList.map(product=>{
            product.goods_img = product.goods_img == '' ? '' : (hostRegex.test(product.goods_img) ? product.goods_img : config.default.ApiHost + product.goods_img);
            return product;
          });
          let subCatList = res.data.goodsCat;
          console.log(productList);
          console.log(subCatList);
          that.setData({
            cid: cid,
            cname: options.cname,
            productList: productList,
            subCatList: subCatList
          });
        }else{
          console.error('无法获取商品列表');
          wx.showToast({
            title: '无法获取商品',
            image: '/images/cross.png'
          })
        }
      },
      fail: function(err){
        console.error(err);
        wx.showToast({
          title: '无法获取商品',
          image: '/images/cross.png'
        });
      }
    });
  },

  chooseProduct: function(e){
    let pid = e.currentTarget.dataset.pid;
    wx.navigateTo({
      url: '/pages/product/productDetail/productDetail?pid=' + pid,
      fail: function(err){
        console.error(err);
      }
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