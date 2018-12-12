// pages/product/productSpec/productSpec.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quantity: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let prodId = options.pid;
    this.setData({
      prodId: prodId
    });
  },

  enterQuantity: function(e){
    this.setData({
      quantity: e.detail.value
    });
  },

  increase: function(e){
    if(!isNaN(this.data.quantity) && this.data.quantity >= 0){
      this.setData({
        quantity: Number(this.data.quantity) + 1
      });
    }else{
      this.setData({
        quantity: 0
      });
    }
    
  },

  decrease: function(e){
    if(!isNaN(this.data.quantity) && this.data.quantity > 0){
      this.setData({
        quantity: Number(this.data.quantity) - 1
      });
    }else{
      this.setData({
        quantity: 0
      });
    }
  },

  resetQuantity: function(e){
    this.setData({
      quantity: 0
    });
  },

  done: function(e){
    if(!isNaN(this.data.quantity) && this.data.quantity >= 0){
      let sku = { sku: '', quantity: this.data.quantity };
      wx.redirectTo({
        url: '../productDetail/productDetail?pid=' + this.data.prodId + '&sku=' + JSON.stringify(sku),
        fail: function(err){
          console.error(err);
        }
      });
    }else{
      console.error('请输入正规数量');
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