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
    if(options.sku !== undefined){
      let sku = JSON.parse(options.sku);
      let disableDecr = (sku.quantity !== undefined && sku.quantity > 0) ? 'less' : 'less dis';
      let quantity = (sku.quantity !== undefined) ? sku.quantity : 0;
      this.setData({
        prodId: prodId,
        disableDecr,
        quantity
      });
    }else{
      this.setData({
        prodId: prodId,
        disableDecr: 'less dis',
        quantity: 0
      });
    }
    
  },

  enterQuantity: function(e){
    let newQuantity = e.detail.value;
    if(/^[0-9]+$/.test(newQuantity) && !isNaN(newQuantity) && newQuantity > 0){
      this.setData({
        quantity: newQuantity,
        disableDecr: 'less'
      });
    }else{
      this.setData({
        quantity: 0,
        disableDecr: 'less dis'
      });
    }
    
  },

  increase: function(e){
    if(!isNaN(this.data.quantity) && this.data.quantity >= 0){
      this.setData({
        quantity: Number(this.data.quantity) + 1,
        disableDecr: 'less'
      });
    }else{
      this.setData({
        quantity: 0,
        disableDecr: 'less dis'
      });
    }
    
  },

  decrease: function(e){
    if(this.data.disableDecr == 'less'){
      if (!isNaN(this.data.quantity) && this.data.quantity > 0) {
        this.setData({
          quantity: Number(this.data.quantity) - 1,
          disableDecr: (Number(this.data.quantity) - 1 > 0) ? 'less' : 'less dis'
        });
      } else {
        this.setData({
          quantity: 0,
          disableDecr: 'less dis'
        });
      }
    }
    
  },

  resetQuantity: function(e){
    this.setData({
      quantity: 0,
      disableDecr: 'less dis'
    });
  },

  done: function(e){
    if(!isNaN(this.data.quantity) && this.data.quantity > 0){
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