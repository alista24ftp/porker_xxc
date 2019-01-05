// pages/member/productCommentList/productCommentList.js
const {ApiHost} = require('../../../config.js');
const {getToken, goLogin} = require('../../../utils/login.js');
const {formatImg, failMsg} = require('../../../utils/util.js');
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
        url: ApiHost + '/xcc/home/commentList',
        method: 'POST',
        data: {token},
        success: function(res){
          console.log(res);
          if(res.data.code == 200){
            if(res.data.type == 1){
              let commentList = res.data.data;
              commentList = commentList.map(comment=>{
                comment.goods_img = formatImg(comment.goods_img);
                comment.com_img = JSON.parse(comment.com_img);
                comment.com_img = comment.com_img.map(img=>formatImg(img));
                return comment;
              });
              that.setData({commentList});
            }else{
              console.error('评价列表为空');
              that.setData({commentList: false});
            }
          }
        },
        fail: function(err){
          console.error(err);
          failMsg('无法获取评论');
          that.setData({commentList: false});
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