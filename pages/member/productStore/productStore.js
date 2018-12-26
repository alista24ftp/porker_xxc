// pages/member/productStore/productStore.js
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
    
  },

  goToProduct: function(e){
    let index = e.currentTarget.dataset.index;
    let prodId = this.data.favList[index].goods_id;
    wx.navigateTo({
      url: '/pages/product/productDetail/productDetail?pid=' + prodId
    });
  },

  removeFav: function(e){
    let index = e.currentTarget.dataset.index;
    let that = this;
    getToken().then(token=>{
      wx.showModal({
        title: '确认删除此收藏',
        content: '您确认是否删除此收藏?',
        confirmText: '删除',
        cancelText: '取消',
        success: function (res) {
          if (res.confirm) {
            console.log('删除');
            wx.request({
              url: ApiHost + '/xcc/home/collection',
              method: 'POST',
              data: {
                token: token,
                goods_id: that.data.favList[index].goods_id
              },
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  if(res.data.type == 1){
                    console.log('删除成功');
                    wx.redirectTo({
                      url: '/pages/member/productStore/productStore',
                      success: function(){
                        successMsg('删除成功');
                      }
                    });
                  }else if(res.data.type == 2){
                    console.error('删除失败');
                    failMsg('删除失败');
                  }else{
                    console.error('删除参数错误');
                    failMsg('删除参数错误');
                  }
                }else{
                  console.error('收藏夹删除操作异常');
                  failMsg('收藏夹删除异常');
                }
                
              },
              fail: function (err) {
                console.error(err);
                failMsg('删除失败');
              }
            });
          }
        }
      });
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
    let that = this;
    getToken().then(token => {
      wx.request({
        url: ApiHost + '/xcc/home/getCollectionList',
        method: 'POST',
        data: {
          token: token
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 200) {
            if (res.data.type == 1) {
              let favList = res.data.data;
              favList = favList.map(item => {
                item.goods_img = formatImg(item.goods_img);
                return item;
              });
              console.log(favList);
              that.setData({
                favList: favList,
                token: token
              });
            } else {
              console.error('收藏夹没有任何商品');
              that.setData({
                favList: [],
                token: token
              });
            }

          } else {
            console.error('获取收藏夹列表状态异常');
            failMsg('获取收藏夹异常');
          }
        },
        fail: function (err) {
          console.error(err);
          failMsg('获取收藏夹失败');
        }
      });
    }, err => {
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