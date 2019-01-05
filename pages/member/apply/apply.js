// pages/member/apply/apply.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {formatImg, successMsg, failMsg, uploadImgs} = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasons: [
      '选择退款原因',
      '未按约定时间发货',
      '服务承诺/态度',
      '不喜欢'
    ],
    reasonIndex: 0,
    amount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderSn = options.ordersn;
    let that = this;
    getToken().then(token=>{
      wx.request({
        url: ApiHost + '/xcc/order/refundPage',
        method: 'POST',
        data: {
          token,
          order_sn: orderSn,
          type: 1
        },
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            let {goods, order} = res.data;
            goods = goods.map(good=>{
              good.goods_img = formatImg(good.goods_img);
              return good;
            });
            that.setData({
              goods, order, orderSn, uploadedImgs: []
            });
          }else{
            failMsg('获取退款异常');
          }
        }
      });
    }, err=>{
      goLogin();
    });
  },

  selectReason: function(e){
    let reasonIndex = e.detail.value;
    this.setData({reasonIndex});
  },

  inputDes: function(e){
    let des = e.detail.value.substring(0, 140);
    this.setData({des});
  },

  chooseImg: function(e){
    let that = this;
    let uploadedImgs = that.data.uploadedImgs;
    getToken().then(token => {
      wx.chooseImage({
        success: function (res) {
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          /*
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
                  uploadedImgs.push(uploadedImg);
                  console.log(uploadedImgs);
                  that.setData({ uploadedImgs });
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
          */
          uploadImgs(token, tempFilePaths).then(imgs=>{
            uploadedImgs = uploadedImgs.concat(imgs);
            console.log(uploadedImgs);
            that.setData({uploadedImgs});
            successMsg('上传成功');
          }, err=>{
            failMsg(err);
            console.error(err);
          });
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
    let that = this;
    let uploadedImgs = that.data.uploadedImgs;
    wx.showModal({
      title: '确认删除评论图片',
      content: '确定删除图片吗?',
      confirmText: '删除',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          uploadedImgs.splice(imgIndex, 1);
          that.setData({ uploadedImgs });
          successMsg('删除图片成功');
        }
      }
    });
  },

  enterAmount: function(e){
    let amount = e.detail.value;
    if (amount != '' && !isNaN(amount) && /^(([1-9]\d*?)|0)(\.\d{0,2}){0,1}$/.test(amount)){
      this.setData({
        amount: amount
      });
    }else{
      this.setData({
        amount: ''
      });
    }
  },

  submitRefund: function(e){
    let that = this;
    let {orderSn, uploadedImgs, amount, des, reasons, reasonIndex} = that.data;
    getToken().then(token=>{
      let re = new RegExp(ApiHost, 'gi');
      let imgs = uploadedImgs.join(',').replace(re, '');
      let reason = reasons[reasonIndex];
      const eps = 1e-8;
      if(reasonIndex == 0){
        failMsg('请选择退款原因');
      }else if(des === undefined || des.trim().length == 0){
        failMsg('请输入退款说明');
      }else if(amount == '' || isNaN(amount)){
        failMsg('请输入正规金额');
      }else if(Math.abs(Number(amount) - 0.00) < eps){
        failMsg('金额必须大于0');
      }else if(Number(amount) - Number(that.data.order.order_price) > eps){
        failMsg('金额超过总金额');
      }else{
        wx.request({
          url: ApiHost + '/xcc/order/refund',
          method: 'POST',
          data: {
            token,
            or_refund: reason,
            order_sn: orderSn,
            or_des: des.trim(),
            or_img: imgs,
            or_price: amount
          },
          success: function (res) {
            console.log(res);
            if(res.data.code == 200){
              if(res.data.type == 1){
                wx.reLaunch({
                  url: '/pages/center/center',
                  success: function(res){
                    successMsg('申请退款成功');
                  }
                });
              }else if(res.data.type == 2){
                failMsg('退款失败');
              }else{
                failMsg('退款参数错误');
              }
            }else{
              failMsg('退款参数错误');
            }
          }
        });
      }
      
    }, err=>{
      goLogin();
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