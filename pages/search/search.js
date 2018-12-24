// pages/search/search.js
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  resetSearch: function(e){
    this.setData({
      keyword: ''
    });
  },

  submitSearch: function(e){
    let keyword = this.data.keyword;
    if(keyword !== undefined)
      keyword = keyword.trim();
    if(keyword != ''){
      wx.navigateTo({
        url: '/pages/product/productSearchList/productSearchList?keyword=' + keyword
      });
    }else{
      console.error('搜索商品关键词不能为空');
      wx.showToast({
        title: '关键词不能为空',
        image: '/images/cross.png'
      })
    }
  },

  inputKeyword: function(e){
    console.log(e);
    this.setData({
      keyword: e.detail.value
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