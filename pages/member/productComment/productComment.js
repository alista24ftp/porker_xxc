// pages/member/productComment/productComment.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {formatImg, successMsg, failMsg} = require('../../../utils/util.js');
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
    let orderId = options.orderid;
    console.log(orderId);
    this.setData({
      orderId,
      goods: false //
    });
  },

  chooseImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods = that.data.goods;
    console.log(that.data.goods);
    getToken().then(token => {
      wx.chooseImage({
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          //console.log(tempFilePaths);
          wx.uploadFile({
            url: ApiHost + '/xcc/home/img',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              token
            },
            success(res) {
              var data = JSON.parse(res.data)
              if (data.code == 200) {
                if (data.type == 1) {
                  let uploadedImg = formatImg(data.msg);
                  goods[index].uploadedImgs.push(uploadedImg);
                  console.log(goods);
                  that.setData({goods});
                  successMsg('上传成功');
                } else {
                  failMsg('上传图片失败');
                  console.error('上传图片失败');
                }
              } else {
                failMsg('上传图片失败');
                console.error('上传图片参数错误');
              }
            },
            fail: function (err) {
              failMsg('无法上传图片');
              console.error(err);
            }
          })
        },
        fail: function (err) {
          console.error(err);
          console.error('取消选择图片');
        }
      });
    }, err => {
      goLogin();
    });

  },

  delImg: function(e){
    let imgIndex = e.currentTarget.dataset.index;
    let prodIndex = e.currentTarget.dataset.good;
    let goods = this.data.goods;
    let that = this;
    wx.showModal({
      title: '确认删除评论图片',
      content: '确定删除图片吗?',
      confirmText: '删除',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          goods[prodIndex].uploadedImgs.splice(imgIndex, 1);
          that.setData({goods});
          successMsg('删除图片成功');
        }
      }
    });
  },

  inputComment: function(e){
    let index = e.currentTarget.dataset.index;
    let comment = e.detail.value;
    //console.log(e);
    let goods = this.data.goods;
    goods[index].comment = comment.substring(0, 140);
    this.setData({goods});
  },

  addComment: function(e){
    let that = this;
    let goods = this.data.goods;
    let orderId = this.data.orderId;
    let comments = this.data.goods.map(good=>(good.comment !== undefined) ? good.comment.trim() : good.comment);
    if(comments.every(comment=>comment !== undefined && comment.length > 0)){
      getToken().then(token => {
        let re = new RegExp(ApiHost, 'gi');
        let comImgs = goods.map(good=>good.uploadedImgs.join(',').replace(re, ''));
        let ids = goods.map(good=>good.goods_id);
        wx.request({
          url: ApiHost + '/xcc/home/commentAdd',
          method: 'POST',
          data: {
            token,
            order_id: orderId,
            goods_id: ids,
            com_img: comImgs,
            com_des: comments
          },
          success: function(res){
            if(res.data.code == 200){
              if(res.data.type == 1){
                console.log('添加成功');
                wx.switchTab({
                  url: '/pages/center/center',
                  success: function(res){
                    successMsg('评论添加成功');
                  }
                });
              }else if(res.data.type == 2){
                console.error('添加评价失败');
                failMsg('添加评价失败');
              }else{
                console.error('添加评价参数错误');
                failMsg('添加参数错误');
              }
            }else{
              console.error('添加评价状态异常');
              failMsg('添加状态异常');
            }
          }
        });
      }, err => {
        goLogin();
      });
    }else{
      console.error('评论不能为空');
      failMsg('评论不能为空');
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
    let that = this;
    getToken().then(token=>{
      wx.request({
        url: ApiHost + '/xcc/home/orderList',
        method: 'POST',
        data: {
          token,
          order_id: that.data.orderId
        },
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              let goods = res.data.data[0].goods;
              let oldGoods = that.data.goods;
              let isNotSame = (oldGoods === false) 
                || (oldGoods.length != goods.length) 
                || oldGoods.some((good, i)=>{good.goods_id != goods[i].goods_id || good.sku_id != goods[i].sku_id});
              if(isNotSame){
                console.log('goods changed');
                goods = goods.map(item => {
                  item.goods_img = formatImg(item.goods_img);
                  item.uploadedImgs = [];
                  return item;
                });
                that.setData({
                  goods
                });
              }
              
            }else if(res.data.type == 2){
              console.error('没有获取到任何订单评价信息');
              that.setData({ goods: false });
            }else{
              console.error('获取订单评价参数错误');
              failMsg('获取参数错误');
              that.setData({ goods: false });
            }
          }else{
            console.error('获取订单评价状态异常');
            failMsg('获取评价异常');
            that.setData({goods: false});
          }
        },
        fail: function(err){
          console.error(err);
          failMsg('获取评价失败');
        }
      });
    }, err=>{
      goLogin();
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