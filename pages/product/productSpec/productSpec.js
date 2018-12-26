// pages/product/productSpec/productSpec.js
const {successMsg, failMsg} = require('../../../utils/util.js');
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
    let prodId = options.pid;
    let specList = JSON.parse(options.spec);
    specList = specList.map(spec => {
      spec.disableDecr = 'less dis';
      spec.quantity = 0;
      spec.disableIncr = spec.sku_stk > 0 ? '' : 'dis';
      return spec;
    });

    if(options.sku !== undefined){
      let sku = JSON.parse(options.sku);
      let disableDecr = (sku.quantity !== undefined && sku.quantity > 0) ? 'less' : 'less dis';
      let quantity = (sku.quantity !== undefined) ? sku.quantity : 0;
      let chosenIndex = undefined;
      specList = specList.map((spec, index)=>{
        if(spec.sku_id == sku.sku_id){
          spec.quantity = quantity;
          spec.disableDecr = disableDecr;
          chosenIndex = index;
          spec.disableIncr = (sku.quantity !== undefined && sku.quantity >= spec.sku_stk) ? 'dis' : '';
        }
        return spec;
      });
      this.setData({
        prodId: prodId,
        specList,
        chosenIndex
      });
    }else{
      
      this.setData({
        prodId: prodId,
        specList
      });
    }
    
  },
  /*
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
  */
  choose: function(e){
    let index = e.currentTarget.dataset.index;
    this.setData({
      chosenIndex: index
    });
  },

  increase: function(e){
    let index = e.currentTarget.dataset.index;
    let specList = this.data.specList;
    if(specList[index].disableIncr == ''){
      if (!isNaN(specList[index].quantity) && specList[index].quantity >= 0) {
        specList[index].quantity = Number(specList[index].quantity) + 1;
        specList[index].disableIncr = specList[index].quantity < specList[index].sku_stk ? '' : 'dis';
        specList[index].disableDecr = 'less';
      } else {
        specList[index].quantity = 0;
        specList[index].disableDecr = 'less dis';
        specList[index].disableIncr = specList[index].sku_stk > 0 ? '' : 'dis';
      }
      this.setData({
        specList
      });
    }
    
  },

  decrease: function(e){
    let index = e.currentTarget.dataset.index;
    let specList = this.data.specList;
    if(specList[index].disableDecr == 'less'){
      if (!isNaN(specList[index].quantity) && specList[index].quantity > 0) {
        specList[index].quantity = Number(specList[index].quantity) - 1;
        specList[index].disableDecr = (Number(specList[index].quantity) > 0) ? 'less' : 'less dis';
        specList[index].disableIncr = specList[index].quantity < specList[index].sku_stk ? '' : 'dis';
      } else {
        specList[index].quantity = 0;
        specList[index].disableDecr = 'less dis';
        specList[index].disableIncr = specList[index].sku_stk > 0 ? '' : 'dis';
      }
      this.setData({
        specList
      });
    }
  },

  resetQuantity: function(e){
    let index = this.data.chosenIndex;
    let specList = this.data.specList;
    if(index !== undefined){
      specList[index].quantity = 0;
      specList[index].disableDecr = 'less dis';
      specList[index].disableIncr = specList[index].sku_stk > 0 ? '' : 'dis';
      this.setData({
        specList
      });
    }else{
      specList = specList.map(spec=>{
        spec.quantity = 0;
        spec.disableDecr = 'less dis';
        spec.disableIncr = spec.sku_stk > 0 ? '' : 'dis';
        return spec;
      });
      this.setData({
        specList
      });
    }
    
  },

  done: function(e){
    let index = this.data.chosenIndex;
    let that = this;
    if(index !== undefined){
      if (!isNaN(this.data.specList[index].quantity) && this.data.specList[index].quantity > 0) {
        let sku = this.data.specList[index];
        wx.redirectTo({
          url: '/pages/product/productDetail/productDetail?pid=' + that.data.prodId + '&sku=' + JSON.stringify(sku),
          success: function(res){
            successMsg('规格选择成功');
          }
        });
        
      } else {
        failMsg('请输入正规数量');
        console.error('请输入正规数量');
      }
    }else{
      failMsg('请选规格与数量');
      console.error('请先选择规格与数量');
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